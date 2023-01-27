function countTruthy(values = []) {
  return values.reduce((sum, value) => sum + (value ? 1 : 0), 0);
}

function isChromium() {
  // Based on research in October 2020. Tested to detect Chromium 42-86.
  const w = window;
  const n = navigator;

  return (
    countTruthy([
      "webkitPersistentStorage" in n,
      "webkitTemporaryStorage" in n,
      n.vendor.indexOf("Google") === 0,
      "webkitResolveLocalFileSystemURL" in w,
      "BatteryManager" in w,
      "webkitMediaStream" in w,
      "webkitSpeechGrammar" in w,
    ]) >= 5
  );
}

function isChromium86OrNewer() {
  // Checked in Chrome 85 vs Chrome 86 both on desktop and Android
  const w = window;

  return (
    countTruthy([
      !("MediaSettingsRange" in w),
      "RTCEncodedAudioFrame" in w,
      "" + w.Intl === "[object Intl]",
      "" + w.Reflect === "[object Reflect]",
    ]) >= 3
  );
}

function getTimezoneOffset() {
  const currentYear = new Date().getFullYear();
  // The timezone offset may change over time due to daylight saving time (DST) shifts.
  // The non-DST timezone offset is used as the result timezone offset.
  // Since the DST season differs in the northern and the southern hemispheres,
  // both January and July timezones offsets are considered.
  return Math.max(
    // `getTimezoneOffset` returns a number as a string in some unidentified cases
    parseFloat(new Date(currentYear, 0, 1).getTimezoneOffset().toString()),
    parseFloat(new Date(currentYear, 6, 1).getTimezoneOffset().toString()),
  );
}

function getLanguages() {
  const n = navigator;
  const result = [];

  const language =
    n.language || n.userLanguage || n.browserLanguage || n.systemLanguage;
  if (language !== undefined) {
    result.push([language]);
  }

  if (Array.isArray(n.languages)) {
    // Starting from Chromium 86, there is only a single value in `navigator.language` in Incognito mode:
    // the value of `navigator.language`. Therefore the value is ignored in this browser.
    if (!(isChromium() && isChromium86OrNewer())) {
      result.push(n.languages);
    }
  } else if (typeof n.languages === "string") {
    const languages = n.languages.toString();
    if (languages) {
      result.push(languages.split(","));
    }
  }

  return result;
}

function makeGeometryImage(canvas) {
  // Resizing the canvas cleans it
  canvas.width = 1222;
  canvas.height = 210;
  const context = canvas.getContext("2d");
  // Canvas blending
  // https://web.archive.org/web/20170826194121/http://blogs.adobe.com/webplatform/2013/01/28/blending-features-in-canvas/
  // http://jsfiddle.net/NDYV8/16/
  context.globalCompositeOperation = "multiply";
  for (const [color, x, y] of [
    ["#f2f", 40, 40],
    ["#2ff", 80, 40],
    ["#ff2", 60, 80],
  ]) {
    context.fillStyle = color;
    context.beginPath();
    context.arc(x, y, 40, 0, Math.PI * 2, true);
    context.closePath();
    context.fill();
  }

  // Canvas winding
  // https://web.archive.org/web/20130913061632/http://blogs.adobe.com/webplatform/2013/01/30/winding-rules-in-canvas/
  // http://jsfiddle.net/NDYV8/19/
  context.fillStyle = "#f9c";
  context.arc(60, 60, 60, 0, Math.PI * 2, true);
  context.arc(60, 60, 20, 0, Math.PI * 2, true);
  context.fill("evenodd");
}

function getPlugins() {
  const rawPlugins = navigator.plugins;

  if (!rawPlugins) {
    return undefined;
  }

  const plugins = [];

  // Safari 10 doesn't support iterating navigator.plugins with for...of
  for (let i = 0; i < rawPlugins.length; ++i) {
    const plugin = rawPlugins[i];
    if (!plugin) {
      continue;
    }

    const mimeTypes = [];
    for (let j = 0; j < plugin.length; ++j) {
      const mimeType = plugin[j];
      mimeTypes.push({
        type: mimeType.type,
        suffixes: mimeType.suffixes,
      });
    }

    plugins.push({
      name: plugin.name,
      description: plugin.description,
      mimeTypes,
    });
  }

  return plugins;
}
function wrapText(context, text, x, y, maxWidth, lineHeight) {
  var words = text.split(" ");
  var line = "";

  for (var n = 0; n < words.length; n++) {
    var testLine = line + words[n] + " ";
    var metrics = context.measureText(testLine);
    var testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      context.fillText(line, x, y);
      line = words[n] + " ";
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  context.fillText(line, x, y);
}

function getCanvasPrint() {
  // create a canvas element
  var canvas = document.createElement("canvas");

  // define a context var that will be used for browsers with canvas support
  var ctx;

  // try/catch for older browsers that don't support the canvas element
  try {
    // attempt to give ctx a 2d canvas context value
    ctx = canvas.getContext("2d");
  } catch (e) {
    // return empty string if canvas element not supported
    return "";
  }

  // https://www.browserleaks.com/canvas#how-does-it-work
  // Text with lowercase/uppercase/punctuation symbols
  makeGeometryImage(canvas);

  let fp = {};
  fp.ts = getTimezoneOffset();
  fp.lang = getLanguages();
  const n = navigator;
  fp.platform = n.platform || "NONE";
  fp.deviceMemory = n.deviceMemory || "NONE";
  fp.appVersion = n.appVersion || "NONE";
  fp.vendor = n.vendor || "NONE";
  fp.plugins = getPlugins();
  fp.width = window.screen.width;
  fp.height = window.screen.height;
  fp.colorDepth = window.screen.colorDepth;
  fp.pixelDepth = window.screen.pixelDepth;

  const txt = "Prifina fingerprint " + JSON.stringify(fp);
  ctx.textBaseline = "top";
  // The most common type
  ctx.font = "14px 'Arial'";
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = "#f60";
  ctx.fillRect(125, 1, 62, 20);

  // Some tricks for color mixing to increase the difference in rendering
  ctx.fillStyle = "#069";
  const maxWidth = 1222;
  const lineHeight = 24;
  const x = (canvas.width - maxWidth) / 2;
  const y = 20;
  //ctx.fillText(txt, 2, 15);
  wrapText(ctx, txt, x, y, maxWidth, lineHeight);

  ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
  //ctx.fillText(txt, 4, 17);
  wrapText(ctx, txt, x + 2, y + 2, maxWidth, lineHeight);
  var fingerPrint = canvas.toDataURL();
  canvas.remove();
  return fingerPrint;
}
