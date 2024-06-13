export function detectBrowser() {
  let sBrowser, sUsrAg = navigator.userAgent

  // Detect browser name
  if (sUsrAg.indexOf("Chrome") > -1) {
    sBrowser = "chrome"
  } else if (sUsrAg.indexOf("Safari") > -1) {
    sBrowser = "safari"
  } else if (sUsrAg.indexOf("Opera") > -1) {
    sBrowser = "opera"
  } else if (sUsrAg.indexOf("Firefox") > -1) {
    sBrowser = "firefox"
  } else if (sUsrAg.indexOf("MSIE") > -1 || sUsrAg.indexOf("Trident") > -1) {
    sBrowser = "ie"
  } else {
    sBrowser = "unknown"
  }

  let device = null;
  if (sUsrAg.match(/Android/i)
    || sUsrAg.match(/webOS/i)
    || sUsrAg.match(/iPhone/i)
    || sUsrAg.match(/iPad/i)
    || sUsrAg.match(/iPod/i)
    || sUsrAg.match(/BlackBerry/i)
    || sUsrAg.match(/Windows Phone/i)) {
    device = "mobile";
  } else {
    device = "pk";
  }

  return [sBrowser, device]
}

export function addBrowserSpecificClass(selectors) {
  let [browserClass] = detectBrowser()

  selectors.forEach(selector => {
    let elements = document.querySelectorAll(selector)
    elements.forEach(element => {
      element.classList.add(browserClass)
    })
  })
}