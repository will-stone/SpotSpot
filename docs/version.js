const version = '3.3.0'

const downloadButton = document.querySelector('#js-download-button')
downloadButton.href = `https://github.com/will-stone/SpotSpot/releases/download/v${version}/SpotSpot-${version}.dmg`

const downloadButtonText = document.querySelector('#js-download-button-text')
downloadButtonText.innerHTML = `Download v${version}`
