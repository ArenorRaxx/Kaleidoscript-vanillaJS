# Kaleidoscript-vanillaJS (unmaintained)

A simple tool for graphs and digital exposés.

## Setup
Please clone this repository in the folder of your choice.

At the *root* of the project, **copy & paste** <code>tsc -t esnext srcs/index.ts</code> into your terminal:
 - <code>tsc</code>: **T**ype**S**cript **c**ompiler;
 - <code>-t</code>: **target** version of compilation | <code>esnext</code> : last version of JS;
 - <code>srcs/index.ts</code>: **TypeScript file** to compile;

This is gonna compile the TS file into a JS file, which is linked to my HTML file in a <code>\<script\></code> already.
Then, **open** <code>srcs/**index.html**</code> in your browser.

Enjoy !

## How To Handle

### Glossary
<u>Node</u> : The representation of a file on the graph.

### Features
- **To add a file**,
start by clicking on the *---Add File button---* on the top-left of the screen, then select a file.

- **To move a file**,
click on the *body* of the <u>node</u> (*light area*) and drag the node around the diagram.

- **To delete a file**,
just double-click on it.

- **To link files together**,
click on the *border* of one <u>node</u> (*dark area*) and drag the temporary link to another <u>node</u>.

- **To remove a link**,
just double-click on it.

- **To visualise a file**,
click once on his <u>node</u>. The Visualiser should slide from the right of the diagram or change his view.

- **To close the Visualiser**,
click again on the <u>node</u> or click once on the background.
---
## About The Project
Hello, thanks for taking time and interest in this project.
Our proud team of developers is composed only by me. The whole team counts me, and my friend
whose idea it was.

Actually, those are the file types supported by Kaleidoscript:
- Text file (**plain** text);
- Image file (**vectorial** not supported);

We hope to implement successfully the support for these file types soon:
- PDF file;
- Code file (with coloration and "code mode" in the Visualiser);

Features coming from a projected mid-far future:
- **Save** and **load** models (A model can be thought of as a presentation);
- **Drag&Drop** file importation;
- Import **multiple files** at once;
- Display a "**tree directory**" of the model;
- **Implement** an "Editor" based on the Visualiser;

Please contact me if you think of an interesting feature. Thanks !
