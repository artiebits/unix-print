# Unix-print

A utility for Unix-like operating systems to print files from Node.js and Electron.

- Understands different types of files, such as PDF, text, PostScript, and image files.
- Supports label printers such as Rollo and Zebra.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

**Table of Contents**

- [Unix-print](#unix-print)
  - [Basic Usage](#basic-usage)
  - [Installation](#installation)
  - [API](#api)
    - [`print(pdf, printer, options) => Promise<void>`](#printpdf-printer-options--promisevoid)
    - [`getPrinters() => Promise<Printer[]>`](#getprinters--promiseprinter)
    - [`getDefaultPrinter() => Promise<Printer | null>`](#getdefaultprinter--promiseprinter--null)
  - [License](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Basic Usage

Print a PDF file to the default printer:

```javascript
import { print } from "unix-print";

print("assets/file.pdf").then(console.log);
```

## Installation

Install using Yarn:

```bash
yarn add unix-print
```

Or using npm:

```bash
npm install --save unix-print
```

## API

### `print(pdf, printer, options) => Promise<void>`

A function to print a file to a printer.

**Arguments**

| Argument |    Type    | Optional | Description                                                                                                                                                    |
| -------- | :--------: | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| file     |  `string`  | Required | A file to print.                                                                                                                                               |
| printer  |  `string`  | Optional | Print a file to the specific printer.                                                                                                                          |
| options  | `string[]` | Optional | Any option from [this list](https://www.computerhope.com/unix/ulp.htm). |

**Returns**

`Promise<void>`.

To print a file to the default printer:

```javascript
import { print } from "unix-print";

print("assets/file.pdf").then(console.log);
```

To print a file to a specific printer:

```javascript
import { print } from "unix-print";

const fileToPrint = "assets/file.pdf";
const printer = "Zebra";

print(fileToPrint, printer).then(console.log);
```

With some printer-specific options:

```javascript
import { print } from "unix-print";

const fileToPrint = "assets/file.jpg";
const printer = undefined;
const options = ["-o landscape", "-o fit-to-page", "-o media=A4"];

print("assets/file.jpg", printer, options).then(console.log);
```

### `getPrinters() => Promise<Printer[]>`

**Returns**

`Promise<Printer[]>`: List of available printers.

**Examples**

```javascript
import { getPrinters } from "unix-print";

getPrinters().then(console.log);
```

### `getDefaultPrinter() => Promise<Printer | null>`

**Returns**

`Promise<Printer | null>`: System default printer or `null`.

**Examples**

```javascript
import { getPrinters } from "unix-print";

getDefaultPrinter().then(console.log);
```

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE) for details.
