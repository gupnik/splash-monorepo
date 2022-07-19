export function svgToPng(svg, callback) {
  svg = `<?xml version="1.0" standalone="no"?>
  <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
  ${svg}`;
  const url = getSvgUrl(svg);
  svgUrlToPng(url, (imgData) => {
    callback(imgData);
    URL.revokeObjectURL(url);
  });
}
function getSvgUrl(svg) {
  return URL.createObjectURL(new Blob([svg], {
    type: 'image/svg+xml'
  }));
}
function svgUrlToPng(svgUrl, callback) {
  const svgImage = document.createElement('img');
  document.body.appendChild(svgImage);
  svgImage.onload = () => {
    const canvas = document.createElement('canvas');
    canvas.width = svgImage.clientWidth;
    canvas.height = svgImage.clientHeight;
    const canvasCtx = canvas.getContext('2d');
    canvasCtx.drawImage(svgImage, 0, 0);

    let png = canvas.toDataURL(); 

    const idx = png.indexOf('base64,') + 'base64,'.length;
    const base64PNG = png.substring(idx);
    // console.log(base64PNG);
    // const imgData = canvas.toDataURL('image/png');
    callback(base64PNG);
  };
  svgImage.onerror = (e) => {
    console.log(e);
  }
  svgImage.src = svgUrl;
}