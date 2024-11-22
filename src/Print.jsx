import { useState, useEffect } from "react";
import * as JSPM from "jsprintmanager";

const PrintManager = () => {
  const [printers, setPrinters] = useState([]);

  useEffect(() => {
    // Start JSPM and get printer info
    JSPM.JSPrintManager.auto_reconnect = true;
    JSPM.JSPrintManager.start();

    JSPM.JSPrintManager.WS.onStatusChanged = () => {
      if (jspmWSStatus()) {
        JSPM.JSPrintManager.getPrinters().then((printersList) => {
          setPrinters(printersList);
        });
      }
    };
  }, []);

  const jspmWSStatus = () => {
    const status = JSPM.JSPrintManager.websocket_status;
    if (status === JSPM.WSStatus.Open) {
      return true;
    } else if (status === JSPM.WSStatus.Closed) {
      alert(
        "JSPrintManager (JSPM) is not installed or not running! Download JSPM Client App from https://neodynamic.com/downloads/jspm"
      );
    } else if (status === JSPM.WSStatus.Blocked) {
      alert("JSPM has blocked this website!");
    }
    return false;
  };

  const handlePrint = () => {
    if (jspmWSStatus()) {
      const cpj = new JSPM.ClientPrintJob();

      // Set Printer
      cpj.clientPrinter = new JSPM.InstalledPrinter("Microsoft Print to PDF");

      // Set Predefined PDF File
      const predefinedPdfUrl = "http://localhost:5173/invoice.pdf"; // Replace with your actual PDF URL
      const myFile = new JSPM.PrintFilePDF(
        predefinedPdfUrl,
        JSPM.FileSourceType.URL,
        "invoice.pdf",
        1
      );
      cpj.files.push(myFile);

      // Send print job
      cpj.sendToClient();
    }
  };

  return (
    <div>
      <h1>React Print Manager</h1>

      {/* Print Button */}
      <button onClick={handlePrint}>Print</button>
    </div>
  );
};

export default PrintManager;
