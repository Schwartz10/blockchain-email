import React from 'react'

function sendToElectron(message) {
  chrome.ipcRenderer.send(message);
}

function openMetamaskPopup(e) {
  // e.preventDefault();
  sendToElectron('open-metamask-popup');
}

function closeMetamaskPopup(e) {
  // e.preventDefault();
  sendToElectron('close-metamask-popup');
}

function openMetamaskNotification() {
  sendToElectron('open-metamask-notification');
}

function closeMetamaskNotification() {
  sendToElectron('close-metamask-notification');
}

const ToggleMetaMask = () => (
  <div>
    <button onClick={(e) => openMetamaskPopup(e)}>Open MetaMask</button>
    <button onClick={(e) => closeMetamaskNotification(e)}>Close MetaMask</button>
    <button onClick={(e) => openMetamaskNotification(e)}>MetaMaskNotification</button>
  </div>
)

export default ToggleMetaMask
