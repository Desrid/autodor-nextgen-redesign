import { readFileSync, readdirSync, statSync } from "node:fs";
import { extname, relative, resolve } from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

import ts from "typescript";

const DEFAULT_TARGET = "app/components/icons";
const SUPPORTED_EXTENSIONS = new Set([".svg", ".tsx"]);
const FORBIDDEN_ELEMENTS = new Set([
  "text",
  "image",
  "foreignobject",
  "filter",
  "mask",
  "clippath",
  "lineargradient",
  "radialgradient",
]);
const COLOR_ATTRIBUTES = new Set([
  "color",
  "fill",
  "floodcolor",
  "lightingcolor",
  "stopcolor",
  "stroke",
]);
const SHAPE_ELEMENTS = new Set([
  "circle",
  "ellipse",
  "line",
  "path",
  "polygon",
  "polyline",
  "rect",
]);
const SVG_ELEMENTS = new Set([
  "defs",
  "desc",
  "g",
  "svg",
  "title",
  "use",
  ...SHAPE_ELEMENTS,
]);
const PATH_PARAMETER_COUNTS = {
  A: 7,
  C: 6,
  H: 1,
  L: 2,
  M: 2,
  Q: 4,
  S: 4,
  T: 2,
  V: 1,
  Z: 0,
};
const SAFE_MIN = 2;
const SAFE_MAX = 22;
const DEFAULT_STROKE_WIDTH = 1.75;

function normalizeAttributeName(name) {
  return name.replaceAll("-", "").toLowerCase();
}

function tagNameText(tagName) {
  return tagName.getText().replace(/^.*\./, "");
}

function attributeValue(attribute) {
  if (!attribute.initializer) return { dynamic: false, value: true };
  if (ts.isStringLiteral(attribute.initializer)) {
    return { dynamic: false, value: attribute.initializer.text };
  }
  if (!ts.isJsxExpression(attribute.initializer)) {
    return { dynamic: true, value: undefined };
  }

  const expression = attribute.initializer.expression;
  if (!expression) return { dynamic: false, value: "" };
  if (
    ts.isStringLiteral(expression) ||
    ts.isNoSubstitutionTemplateLiteral(expression)
  ) {
    return { dynamic: false, value: expression.text };
  }
  if (ts.isNumericLiteral(expression)) {
    return { dynamic: false, value: Number(expression.text) };
  }
  if (expression.kind === ts.SyntaxKind.TrueKeyword) {
    return { dynamic: false, value: true };
  }
  if (expression.kind === ts.SyntaxKind.FalseKeyword) {
    return { dynamic: false, value: false };
  }
  return { dynamic: true, value: undefined };
}

function readAttributes(opening, report) {
  const attributes = new Map();
  for (const property of opening.attributes.properties) {
    if (ts.isJsxSpreadAttribute(property)) {
      report(
        "svg.no-spread",
        "SVG attributes must be explicit; JSX spreads are not allowed.",
      );
      continue;
    }
    const originalName = property.name.getText();
    attributes.set(normalizeAttributeName(originalName), {
      originalName,
      ...attributeValue(property),
    });
  }
  return attributes;
}

function finiteNumber(value) {
  const number = typeof value === "number" ? value : Number(value);
  return Number.isFinite(number) ? number : undefined;
}

function addPoint(bounds, x, y) {
  if (!Number.isFinite(x) || !Number.isFinite(y)) return;
  bounds.minX = Math.min(bounds.minX, x);
  bounds.minY = Math.min(bounds.minY, y);
  bounds.maxX = Math.max(bounds.maxX, x);
  bounds.maxY = Math.max(bounds.maxY, y);
}

function vectorAngle(ux, uy, vx, vy) {
  const denominator = Math.hypot(ux, uy) * Math.hypot(vx, vy);
  if (denominator === 0) return 0;
  const cosine = Math.min(1, Math.max(-1, (ux * vx + uy * vy) / denominator));
  const sign = ux * vy - uy * vx < 0 ? -1 : 1;
  return sign * Math.acos(cosine);
}

function addArc(bounds, startX, startY, values, relativeCommand) {
  let [radiusX, radiusY, rotation, largeArc, sweep, endX, endY] = values;
  if (relativeCommand) {
    endX += startX;
    endY += startY;
  }
  radiusX = Math.abs(radiusX);
  radiusY = Math.abs(radiusY);
  addPoint(bounds, startX, startY);
  addPoint(bounds, endX, endY);
  if (radiusX === 0 || radiusY === 0 || (startX === endX && startY === endY)) {
    return { x: endX, y: endY };
  }

  const phi = (rotation * Math.PI) / 180;
  const cosPhi = Math.cos(phi);
  const sinPhi = Math.sin(phi);
  const dx = (startX - endX) / 2;
  const dy = (startY - endY) / 2;
  const transformedX = cosPhi * dx + sinPhi * dy;
  const transformedY = -sinPhi * dx + cosPhi * dy;
  const scale = transformedX ** 2 / radiusX ** 2 + transformedY ** 2 / radiusY ** 2;
  if (scale > 1) {
    const factor = Math.sqrt(scale);
    radiusX *= factor;
    radiusY *= factor;
  }

  const numerator = Math.max(
    0,
    radiusX ** 2 * radiusY ** 2 -
      radiusX ** 2 * transformedY ** 2 -
      radiusY ** 2 * transformedX ** 2,
  );
  const denominator =
    radiusX ** 2 * transformedY ** 2 + radiusY ** 2 * transformedX ** 2;
  const direction = Boolean(largeArc) === Boolean(sweep) ? -1 : 1;
  const coefficient = direction * Math.sqrt(numerator / Math.max(denominator, 1e-12));
  const centerPrimeX = (coefficient * radiusX * transformedY) / radiusY;
  const centerPrimeY = (-coefficient * radiusY * transformedX) / radiusX;
  const centerX = cosPhi * centerPrimeX - sinPhi * centerPrimeY + (startX + endX) / 2;
  const centerY = sinPhi * centerPrimeX + cosPhi * centerPrimeY + (startY + endY) / 2;
  const startAngle = vectorAngle(
    1,
    0,
    (transformedX - centerPrimeX) / radiusX,
    (transformedY - centerPrimeY) / radiusY,
  );
  let sweepAngle = vectorAngle(
    (transformedX - centerPrimeX) / radiusX,
    (transformedY - centerPrimeY) / radiusY,
    (-transformedX - centerPrimeX) / radiusX,
    (-transformedY - centerPrimeY) / radiusY,
  );
  if (!sweep && sweepAngle > 0) sweepAngle -= Math.PI * 2;
  if (sweep && sweepAngle < 0) sweepAngle += Math.PI * 2;

  for (let index = 0; index <= 64; index += 1) {
    const angle = startAngle + (sweepAngle * index) / 64;
    const x =
      centerX + cosPhi * radiusX * Math.cos(angle) - sinPhi * radiusY * Math.sin(angle);
    const y =
      centerY + sinPhi * radiusX * Math.cos(angle) + cosPhi * radiusY * Math.sin(angle);
    addPoint(bounds, x, y);
  }
  return { x: endX, y: endY };
}

function pathBounds(pathData) {
  const tokenPattern =
    /[AaCcHhLlMmQqSsTtVvZz]|[-+]?(?:\d*\.\d+|\d+\.?)(?:[eE][-+]?\d+)?/g;
  const tokens = [];
  let lastIndex = 0;
  for (const match of pathData.matchAll(tokenPattern)) {
    if (!/^[\s,]*$/.test(pathData.slice(lastIndex, match.index))) {
      throw new Error(
        `unsupported path syntax near "${pathData.slice(lastIndex, match.index + 8)}"`,
      );
    }
    tokens.push(match[0]);
    lastIndex = (match.index ?? 0) + match[0].length;
  }
  if (!/^[\s,]*$/.test(pathData.slice(lastIndex))) {
    throw new Error("unsupported path syntax at the end of d");
  }

  const bounds = {
    minX: Number.POSITIVE_INFINITY,
    minY: Number.POSITIVE_INFINITY,
    maxX: Number.NEGATIVE_INFINITY,
    maxY: Number.NEGATIVE_INFINITY,
  };
  let index = 0;
  let command;
  let currentX = 0;
  let currentY = 0;
  let startX = 0;
  let startY = 0;
  let previousCubicControl;
  let previousQuadraticControl;

  while (index < tokens.length) {
    if (/^[A-Za-z]$/.test(tokens[index])) {
      command = tokens[index];
      index += 1;
    } else if (!command) {
      throw new Error("path data must start with a command");
    }

    const upperCommand = command.toUpperCase();
    const parameterCount = PATH_PARAMETER_COUNTS[upperCommand];
    if (parameterCount === undefined)
      throw new Error(`unsupported path command ${command}`);
    if (upperCommand === "Z") {
      currentX = startX;
      currentY = startY;
      addPoint(bounds, currentX, currentY);
      previousCubicControl = undefined;
      previousQuadraticControl = undefined;
      command = undefined;
      continue;
    }
    if (index + parameterCount > tokens.length) {
      throw new Error(`path command ${command} has too few parameters`);
    }
    if (/^[A-Za-z]$/.test(tokens[index])) {
      throw new Error(`path command ${command} has no parameters`);
    }

    const values = tokens.slice(index, index + parameterCount).map(Number);
    index += parameterCount;
    const relativeCommand = command === command.toLowerCase();
    const absolutePoint = (x, y) => ({
      x: relativeCommand ? currentX + x : x,
      y: relativeCommand ? currentY + y : y,
    });
    const priorX = currentX;
    const priorY = currentY;

    if (upperCommand === "M" || upperCommand === "L" || upperCommand === "T") {
      const point = absolutePoint(values[0], values[1]);
      if (upperCommand === "T") {
        const control = previousQuadraticControl
          ? {
              x: currentX * 2 - previousQuadraticControl.x,
              y: currentY * 2 - previousQuadraticControl.y,
            }
          : { x: currentX, y: currentY };
        addPoint(bounds, control.x, control.y);
        previousQuadraticControl = control;
      } else {
        previousQuadraticControl = undefined;
      }
      currentX = point.x;
      currentY = point.y;
      addPoint(bounds, currentX, currentY);
      if (upperCommand === "M") {
        startX = currentX;
        startY = currentY;
        command = relativeCommand ? "l" : "L";
      }
      previousCubicControl = undefined;
    } else if (upperCommand === "H") {
      currentX = relativeCommand ? currentX + values[0] : values[0];
      addPoint(bounds, currentX, currentY);
      previousCubicControl = undefined;
      previousQuadraticControl = undefined;
    } else if (upperCommand === "V") {
      currentY = relativeCommand ? currentY + values[0] : values[0];
      addPoint(bounds, currentX, currentY);
      previousCubicControl = undefined;
      previousQuadraticControl = undefined;
    } else if (upperCommand === "C") {
      const first = absolutePoint(values[0], values[1]);
      const second = absolutePoint(values[2], values[3]);
      const end = absolutePoint(values[4], values[5]);
      addPoint(bounds, first.x, first.y);
      addPoint(bounds, second.x, second.y);
      addPoint(bounds, end.x, end.y);
      currentX = end.x;
      currentY = end.y;
      previousCubicControl = second;
      previousQuadraticControl = undefined;
    } else if (upperCommand === "S") {
      const reflected = previousCubicControl
        ? {
            x: currentX * 2 - previousCubicControl.x,
            y: currentY * 2 - previousCubicControl.y,
          }
        : { x: currentX, y: currentY };
      const second = absolutePoint(values[0], values[1]);
      const end = absolutePoint(values[2], values[3]);
      addPoint(bounds, reflected.x, reflected.y);
      addPoint(bounds, second.x, second.y);
      addPoint(bounds, end.x, end.y);
      currentX = end.x;
      currentY = end.y;
      previousCubicControl = second;
      previousQuadraticControl = undefined;
    } else if (upperCommand === "Q") {
      const control = absolutePoint(values[0], values[1]);
      const end = absolutePoint(values[2], values[3]);
      addPoint(bounds, control.x, control.y);
      addPoint(bounds, end.x, end.y);
      currentX = end.x;
      currentY = end.y;
      previousQuadraticControl = control;
      previousCubicControl = undefined;
    } else if (upperCommand === "A") {
      const end = addArc(bounds, priorX, priorY, values, relativeCommand);
      currentX = end.x;
      currentY = end.y;
      previousCubicControl = undefined;
      previousQuadraticControl = undefined;
    }
  }

  return bounds;
}

function primitiveBounds(tagName, attributes) {
  const number = (name, fallback) => {
    const attribute = attributes.get(name);
    if (!attribute) return fallback;
    if (attribute.dynamic) return undefined;
    return finiteNumber(attribute.value);
  };
  if (tagName === "path") {
    const data = attributes.get("d");
    if (!data || data.dynamic || typeof data.value !== "string") return undefined;
    return pathBounds(data.value);
  }
  if (tagName === "line") {
    const values = [number("x1", 0), number("y1", 0), number("x2", 0), number("y2", 0)];
    if (values.some((value) => value === undefined)) return undefined;
    return {
      minX: Math.min(values[0], values[2]),
      minY: Math.min(values[1], values[3]),
      maxX: Math.max(values[0], values[2]),
      maxY: Math.max(values[1], values[3]),
    };
  }
  if (tagName === "circle") {
    const cx = number("cx", 0);
    const cy = number("cy", 0);
    const radius = number("r");
    if ([cx, cy, radius].some((value) => value === undefined)) return undefined;
    return {
      minX: cx - radius,
      minY: cy - radius,
      maxX: cx + radius,
      maxY: cy + radius,
    };
  }
  if (tagName === "ellipse") {
    const cx = number("cx", 0);
    const cy = number("cy", 0);
    const radiusX = number("rx");
    const radiusY = number("ry");
    if ([cx, cy, radiusX, radiusY].some((value) => value === undefined))
      return undefined;
    return {
      minX: cx - radiusX,
      minY: cy - radiusY,
      maxX: cx + radiusX,
      maxY: cy + radiusY,
    };
  }
  if (tagName === "rect") {
    const x = number("x", 0);
    const y = number("y", 0);
    const width = number("width");
    const height = number("height");
    if ([x, y, width, height].some((value) => value === undefined)) return undefined;
    return { minX: x, minY: y, maxX: x + width, maxY: y + height };
  }
  if (tagName === "polyline" || tagName === "polygon") {
    const points = attributes.get("points");
    if (!points || points.dynamic || typeof points.value !== "string") return undefined;
    const values = points.value
      .trim()
      .split(/[\s,]+/)
      .filter(Boolean)
      .map(Number);
    if (values.length < 2 || values.length % 2 !== 0 || values.some(Number.isNaN)) {
      throw new Error("points must contain numeric x,y pairs");
    }
    const bounds = {
      minX: Number.POSITIVE_INFINITY,
      minY: Number.POSITIVE_INFINITY,
      maxX: Number.NEGATIVE_INFINITY,
      maxY: Number.NEGATIVE_INFINITY,
    };
    for (let index = 0; index < values.length; index += 2) {
      addPoint(bounds, values[index], values[index + 1]);
    }
    return bounds;
  }
  return undefined;
}

function hasAccessibleButtonName(opening) {
  const names = new Set(
    opening.attributes.properties
      .filter(ts.isJsxAttribute)
      .map((attribute) => normalizeAttributeName(attribute.name.getText())),
  );
  return names.has("arialabel") || names.has("arialabelledby") || names.has("title");
}

function buttonIsIconOnly(node) {
  if (!ts.isJsxElement(node)) return false;
  return !node.children.some((child) => {
    if (ts.isJsxText(child)) return child.getText().trim().length > 0;
    if (ts.isJsxExpression(child)) {
      const expression = child.expression;
      return Boolean(
        expression &&
        (ts.isStringLiteral(expression) || ts.isTemplateExpression(expression)),
      );
    }
    const opening = ts.isJsxElement(child) ? child.openingElement : child;
    const name = tagNameText(opening.tagName);
    return name !== "svg" && !/Icon$/.test(name);
  });
}

export function validateSource(source, filePath = "icon.tsx") {
  const extension = extname(filePath).toLowerCase();
  const lineOffset = extension === ".svg" ? 1 : 0;
  const preparedSource =
    extension === ".svg"
      ? `const __icon = (${source.replace(/<\?(?:xml)[^>]*>|<!doctype[^>]*>/gi, "")});`
      : source;
  const sourceFile = ts.createSourceFile(
    filePath,
    preparedSource,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  const errors = [];
  let svgCount = 0;
  const reportAt = (node, rule, message) => {
    const position = sourceFile.getLineAndCharacterOfPosition(
      node.getStart(sourceFile),
    );
    errors.push({ line: Math.max(1, position.line + 1 - lineOffset), message, rule });
  };

  for (const diagnostic of sourceFile.parseDiagnostics ?? []) {
    const position = sourceFile.getLineAndCharacterOfPosition(diagnostic.start ?? 0);
    errors.push({
      line: position.line + 1,
      message: ts.flattenDiagnosticMessageText(diagnostic.messageText, " "),
      rule: "syntax",
    });
  }

  function visit(node) {
    const opening = ts.isJsxElement(node)
      ? node.openingElement
      : ts.isJsxSelfClosingElement(node)
        ? node
        : undefined;
    if (opening) {
      const rawTagName = tagNameText(opening.tagName);
      const nativeTagName =
        rawTagName === rawTagName.toLowerCase() ? rawTagName : undefined;
      const isSvgElement = nativeTagName && SVG_ELEMENTS.has(nativeTagName);
      const report = (rule, message) => reportAt(opening, rule, message);
      const attributes = readAttributes(opening, report);

      if (nativeTagName && FORBIDDEN_ELEMENTS.has(nativeTagName)) {
        report("svg.forbidden-element", `<${rawTagName}> is forbidden in UI icons.`);
      }
      for (const [name, attribute] of isSvgElement ? attributes : []) {
        if (name === "style" || name === "dangerouslysetinnerhtml") {
          report("svg.forbidden-attribute", `${attribute.originalName} is forbidden.`);
        }
        if (name === "transform" && attribute.value !== "") {
          report(
            "svg.transform",
            "transform is not allowed; author final geometry directly.",
          );
        }
        if (!attribute.dynamic && typeof attribute.value === "string") {
          if (/data:|https?:\/\/|url\s*\(|^\/\//i.test(attribute.value)) {
            report(
              "svg.external-resource",
              `${attribute.originalName} contains an external or data URL.`,
            );
          }
          if (COLOR_ATTRIBUTES.has(name)) {
            const allowed = new Set(["none", "currentColor", "transparent"]);
            if (!allowed.has(attribute.value)) {
              report(
                "svg.color",
                `${attribute.originalName} must use currentColor or none, received "${attribute.value}".`,
              );
            }
          }
        }
        if (attribute.dynamic && (name === "href" || name === "xlinkhref")) {
          report(
            "svg.external-resource",
            `${attribute.originalName} must not be dynamic or reference an external resource.`,
          );
        }
      }

      if (nativeTagName === "svg") {
        svgCount += 1;
        const required = {
          fill: "none",
          stroke: "currentColor",
          strokelinecap: "round",
          strokelinejoin: "round",
          strokewidth: 1.75,
          viewbox: "0 0 24 24",
        };
        for (const [name, expected] of Object.entries(required)) {
          const attribute = attributes.get(name);
          if (!attribute || attribute.dynamic || attribute.value !== expected) {
            report(
              "svg.contract",
              `${name} must be exactly ${JSON.stringify(expected)}.`,
            );
          }
        }
        for (const dimension of ["width", "height"]) {
          const attribute = attributes.get(dimension);
          if (attribute && !attribute.dynamic) {
            report(
              "svg.responsive-size",
              `${dimension} must be supplied by props, CSS, or a container, not hardcoded.`,
            );
          }
        }
        const focusable = attributes.get("focusable");
        if (!focusable || focusable.dynamic || String(focusable.value) !== "false") {
          report("a11y.focusable", 'SVG must set focusable="false".');
        }
        const ariaHidden = attributes.get("ariahidden");
        const ariaLabel = attributes.get("arialabel");
        const hasTitle =
          ts.isJsxElement(node) &&
          node.children.some((child) => {
            const childOpening = ts.isJsxElement(child)
              ? child.openingElement
              : ts.isJsxSelfClosingElement(child)
                ? child
                : undefined;
            return childOpening && tagNameText(childOpening.tagName) === "title";
          });
        if (hasTitle && ariaLabel) {
          report(
            "a11y.conflict",
            "Do not combine <title> and aria-label on the same icon.",
          );
        }
        const hiddenIsTrue =
          ariaHidden && !ariaHidden.dynamic && String(ariaHidden.value) === "true";
        if (
          (!ariaHidden || (!ariaHidden.dynamic && !hiddenIsTrue)) &&
          !ariaLabel &&
          !hasTitle
        ) {
          report(
            "a11y.name",
            "Set aria-hidden for decorative icons or expose an aria-label/title through props.",
          );
        }
        if (hiddenIsTrue && (ariaLabel || hasTitle)) {
          report(
            "a11y.conflict",
            "aria-hidden must not be combined with an accessible name.",
          );
        }
        if (ariaHidden?.dynamic && !ariaLabel && !hasTitle) {
          report(
            "a11y.name",
            "Dynamic aria-hidden requires a matching dynamic accessible name.",
          );
        }
      }

      if (nativeTagName && SHAPE_ELEMENTS.has(nativeTagName)) {
        try {
          const bounds = primitiveBounds(nativeTagName, attributes);
          if (!bounds) {
            report(
              "svg.safe-area-unverifiable",
              `<${nativeTagName}> geometry must use static numeric values for safe-area validation.`,
            );
          } else {
            const strokeWidthAttribute = attributes.get("strokewidth");
            const strokeWidth =
              strokeWidthAttribute && !strokeWidthAttribute.dynamic
                ? finiteNumber(strokeWidthAttribute.value)
                : DEFAULT_STROKE_WIDTH;
            const inset = (strokeWidth ?? DEFAULT_STROKE_WIDTH) / 2;
            if (
              bounds.minX - inset < SAFE_MIN - 1e-6 ||
              bounds.minY - inset < SAFE_MIN - 1e-6 ||
              bounds.maxX + inset > SAFE_MAX + 1e-6 ||
              bounds.maxY + inset > SAFE_MAX + 1e-6
            ) {
              report(
                "svg.safe-area",
                `visual bounds ${bounds.minX.toFixed(2)},${bounds.minY.toFixed(2)}–${bounds.maxX.toFixed(2)},${bounds.maxY.toFixed(2)} exceed the 2..22 safe area with stroke.`,
              );
            }
          }
        } catch (error) {
          report(
            "svg.path-data",
            error instanceof Error ? error.message : String(error),
          );
        }
      }

      if (
        nativeTagName === "button" &&
        buttonIsIconOnly(node) &&
        !hasAccessibleButtonName(opening)
      ) {
        report(
          "a11y.icon-button",
          "An icon-only button must have aria-label or aria-labelledby.",
        );
      }
    }
    ts.forEachChild(node, visit);
  }
  visit(sourceFile);
  return { errors, svgCount };
}

function collectFiles(targetPath) {
  const absoluteTarget = resolve(targetPath);
  const stats = statSync(absoluteTarget);
  if (stats.isFile()) {
    if (!SUPPORTED_EXTENSIONS.has(extname(absoluteTarget).toLowerCase())) {
      throw new Error(`Unsupported icon file: ${targetPath}`);
    }
    return [absoluteTarget];
  }
  return readdirSync(absoluteTarget, { withFileTypes: true }).flatMap((entry) => {
    const childPath = resolve(absoluteTarget, entry.name);
    if (entry.isDirectory()) return collectFiles(childPath);
    return SUPPORTED_EXTENSIONS.has(extname(entry.name).toLowerCase())
      ? [childPath]
      : [];
  });
}

export function validateFiles(targets) {
  const results = [];
  for (const target of targets) {
    const files = collectFiles(target);
    for (const filePath of files) {
      const validation = validateSource(readFileSync(filePath, "utf8"), filePath);
      if (statSync(resolve(target)).isFile() && validation.svgCount === 0) {
        validation.errors.push({
          line: 1,
          message: "No inline <svg> root was found in the requested file.",
          rule: "svg.missing",
        });
      }
      results.push({ filePath, ...validation });
    }
  }
  return results;
}

function main() {
  const targets = process.argv.slice(2);
  const requestedTargets = targets.length > 0 ? targets : [DEFAULT_TARGET];
  let results;
  try {
    results = validateFiles(requestedTargets);
  } catch (error) {
    console.error(`[icons] ${error instanceof Error ? error.message : String(error)}`);
    process.exitCode = 1;
    return;
  }

  const failures = results.flatMap((result) =>
    result.errors.map((error) => ({ ...error, filePath: result.filePath })),
  );
  for (const failure of failures) {
    console.error(
      `${relative(process.cwd(), failure.filePath)}:${failure.line} [${failure.rule}] ${failure.message}`,
    );
  }
  const svgCount = results.reduce((total, result) => total + result.svgCount, 0);
  if (failures.length > 0) {
    console.error(
      `[icons] FAIL ${failures.length} violation(s) in ${results.length} file(s).`,
    );
    process.exitCode = 1;
    return;
  }
  console.log(
    `[icons] PASS ${results.length} file(s), ${svgCount} inline SVG root(s).`,
  );
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main();
}
