import React from "react";

import { ZoomInIcon, ZoomOutIcon, DeleteIcon, DownloadIcon, CloseIcon, RotateIcon } from "./icons";

function isSameOrigin(href) {
  // @ts-ignore
  return document.location.hostname !== new URL(href, document.location).hostname
}

/**
 * Triggers image download from cross origin URLs
 * 
 * `<a href="..." download>foo</a> works only for same-origin URLs.
 * Further info: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#attr-download
 */

const crossOriginDownload = href => event => {
  if (!isSameOrigin(href)) {
    // native download will be triggered by `download` attribute
    return
  }

  // else proceed to use `fetch` for cross origin image download

  event.preventDefault();

  fetch(href)
    .then(res => {
      if (!res.ok) {
        console.error("Failed to download image, HTTP status " + res.status +  " from " + href)
      }

      return res.blob().then(blob => {
        let tmpAnchor = document.createElement("a")
        tmpAnchor.setAttribute("download", href.split("/").pop())
        tmpAnchor.href = URL.createObjectURL(blob)
        tmpAnchor.click()
      })
    })
    .catch(err => {
      console.error(err)
      console.error("Failed to download image from " + href)
    })
};

const deleteImage = href => event => {
  event.preventDefault();
  const req = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ urls: [href] })
};

  fetch('https://file-storage-backend-original.onrender.com/api/bucket/delete', req)
    .then(res => {
      if (!res.ok) {
        console.error("Failed to delete image, HTTP status " + res.status +  " from " + href)
      }

      // removes container div for image
      const containerDiv = event.target.closest("ul > div")
      containerDiv.remove()
    })
    .catch(err => {
      console.error(err)
      console.error("Failed to download image from " + href)
    })
};


const Header = ({
  image,
  alt,
  zoomed,
  toggleZoom,
  toggleRotate,
  onClose,
  enableDownload,
  enableZoom,
  enableRotate,
  enableDelete,
}) => (
  <div className="__react_modal_image__header">
    <span className="__react_modal_image__icon_menu">
      {enableDelete && (
        <a href={image} onClick={deleteImage(image)}>
          <DeleteIcon />
        </a>
      )}
      {enableDownload && (
        <a href={image} download onClick={crossOriginDownload(image)}>
          <DownloadIcon />
        </a>
      )}
      {enableZoom && (
        <a onClick={toggleZoom}>
          {zoomed ? <ZoomOutIcon /> : <ZoomInIcon />}
        </a>
      )}
      {enableRotate && (
        <a onClick={toggleRotate}>
          <RotateIcon />
        </a>
      )}
      <a onClick={onClose}>
        <CloseIcon />
      </a>
    </span>
    {alt && <span className="__react_modal_image__caption">{alt}</span>}
  </div>
);

export default Header;
