// Photoshop ExtendScript
// Hintergrundebene (unterste Ebene) von Cyan → Weiß umfärben
// Starten: Datei > Skripts > Skript ausführen...

#target photoshop

main();

function main() {
    var folder = Folder.selectDialog("Ordner mit PSD-Dateien wählen");
    if (!folder) return;

    var files = folder.getFiles(/\.psd$/i);
    if (files.length === 0) {
        alert("Keine PSD-Dateien im gewählten Ordner gefunden.");
        return;
    }

    var white = new SolidColor();
    white.rgb.red   = 255;
    white.rgb.green = 255;
    white.rgb.blue  = 255;

    for (var i = 0; i < files.length; i++) {
        var doc = app.open(files[i]);

        // Unterste Ebene = Hintergrundebene
        var bgLayer = doc.layers[doc.layers.length - 1];
        doc.activeLayer = bgLayer;

        // Gesperrte Hintergrundebene entsperren falls nötig
        if (bgLayer.isBackgroundLayer) {
            bgLayer.isBackgroundLayer = false;
        }

        // Gesamte Ebene mit Weiß füllen
        if (bgLayer.kind === LayerKind.SOLIDFILL) {
            // Einfarbig-Füllebene: Farbe direkt ändern
            setSolidFillColor(white);
        } else {
            // Normale Rasterebene: Alles auswählen und füllen
            doc.selection.selectAll();
            doc.selection.fill(white, ColorBlendMode.NORMAL, 100, false);
            doc.selection.deselect();
        }

        doc.save();
        doc.close(SaveOptions.DONOTSAVECHANGES);
    }

    alert("Fertig! " + files.length + " PSD(s) aktualisiert.");
}

// Ändert die Farbe einer Einfarbig-Füllebene via Action Manager
function setSolidFillColor(color) {
    var ref = new ActionReference();
    ref.putEnumerated(
        charIDToTypeID("Lyr "),
        charIDToTypeID("Ordn"),
        charIDToTypeID("Trgt")
    );

    var colorDesc = new ActionDescriptor();
    colorDesc.putDouble(charIDToTypeID("Rd  "), color.rgb.red);
    colorDesc.putDouble(charIDToTypeID("Grn "), color.rgb.green);
    colorDesc.putDouble(charIDToTypeID("Bl  "), color.rgb.blue);

    var contentDesc = new ActionDescriptor();
    contentDesc.putObject(charIDToTypeID("Clr "), charIDToTypeID("RGBC"), colorDesc);

    var layerDesc = new ActionDescriptor();
    layerDesc.putObject(charIDToTypeID("Cntnt"), charIDToTypeID("SClr"), contentDesc);

    var mainDesc = new ActionDescriptor();
    mainDesc.putReference(charIDToTypeID("null"), ref);
    mainDesc.putObject(charIDToTypeID("T   "), charIDToTypeID("Lyr "), layerDesc);

    executeAction(charIDToTypeID("setd"), mainDesc, DialogModes.NO);
}
