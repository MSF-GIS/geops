'use strict';

import FileSaver from 'file-saver';
import jsPDF from 'jspdf';
import ol from 'openlayers/build/ol.custom';
import { TILE_LYR_GR_TITLE } from '../../variables';

function toPNG(this_) {

  /*
   * Export simple sous forme de png du canvas correspondant 
   * à la map. Problème : pas de légénde. Solution à creuser : 
   * html2canvas (70K de js en plus) sur le div webmap en feintant
   * pour n'afficher que les contrôles souhaités dans l'export png
   */
  
  const map = this_.getMap();    
  map.once('postcompose', function(event) {
  const canvas = event.context.canvas;
    if (navigator.msSaveBlob) {
      navigator.msSaveBlob(canvas.msToBlob(), 'map.png');
    } else {
      canvas.toBlob(function(blob) {
        FileSaver.saveAs(blob, 'map.png');
      });
    }
  });
  map.renderSync();
}

function toPDF(this_) {

  /*
   * Verision simplifiée de la sauvegarde de la carte sous forme de PDF
   * possibilité de jouer sur la taille de la carte pour sauvegardé en
   * format standard type A4 et possibilité de modifier la résolution de
   * la sauvegarde
   */

  const map = this_.getMap(); 
  map.once('postcompose', function(event) {
    const mapSize = map.get('size');
    const dim = [297, 210];
    const ratio = dim[0] / mapSize[0];
    const canvas = event.context.canvas
    const data = canvas.toDataURL('image/png');
    const pdf = new jsPDF('landscape', undefined, 'a4');
    pdf.addImage(data, 'JPEG', 0, 20, mapSize[0] * ratio, mapSize[1] * ratio);
    pdf.save('map.pdf');
  });
  map.renderSync();
}

const ExportControl = function() {
  const PNGExportButton = document.createElement('button');
  PNGExportButton.innerHTML = 'Export as PNG';

  const PDFExportButton = document.createElement('button');
  PDFExportButton.innerHTML = 'Export as PDF';

  const PNGExportItem = document.createElement('li');
  PNGExportItem.appendChild(PNGExportButton);

  const PDFExportItem = document.createElement('li');
  PDFExportItem.appendChild(PDFExportButton);

  const exportList = document.createElement('ul');
  exportList.classList.add('d-none');
  exportList.appendChild(PNGExportItem);
  exportList.appendChild(PDFExportItem);

  const button = document.createElement('button');
  button.id = 'export-control-button';
  button.innerHTML = '<i class="fa fa-download" aria-hidden="true"></i>';

  const container = document.createElement('div');
  container.id = 'export-control';
  container.classList.add('ol-control', 'ol-unselectable');
  container.appendChild(button);
  container.appendChild(exportList);

  button.addEventListener('mouseenter', () => {
    exportList.classList.remove('d-none');
  });

  container.addEventListener('mouseleave', () => {
    exportList.classList.add('d-none');
  });

  const this_ = this;
  PNGExportButton.addEventListener('click', toPNG.bind(this, this_));
  PDFExportButton.addEventListener('click', toPDF.bind(this, this_));

  ol.control.Control.call(this, {
    element: container,
  });
}

ol.inherits(ExportControl, ol.control.Control);

export default ExportControl;