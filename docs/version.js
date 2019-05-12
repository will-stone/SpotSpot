const version = '3.2.0'

const buttonsContainer = document.getElementById('js-buttons')

const downloadButton = document.createElement('a')
downloadButton.classList.add('button')
downloadButton.href = `https://github.com/will-stone/SpotSpot/releases/download/v${version}/SpotSpot-${version}.dmg`
downloadButton.innerHTML = `Download v${version}`

buttonsContainer.appendChild(downloadButton)
