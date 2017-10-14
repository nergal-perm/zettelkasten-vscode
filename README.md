# Zettelkasten README

This is a simple extension which provides means to create links between Markdown documents in a 'Zettelkasten' way.

> IMPORTANT - this is a work in progress and is far from the product quality, so use it on your own risk and always make backups of your data.

## Creating links to notes

To create a link to a new file press "Ctrl + Shift + P / F1" and type "zettel", then choose command "New Zettel link" and press "Enter". Or you can use keyboard shortcut "Ctrl + Shift + =".

This will create a new link, like this:

```
(z:1507347558083)
```

Here "z" - is the zettelkasten link prefix (you can change this by overwriting config property `zettel.linkPrefix`), and the numbers are the timestamp of link creation operation. Now, if you CTRL-click this link you will be prompted to create a new file with this identifier in your current workspace folder.

If the file with such an identifier exists, CTRL-clicking on a link will open that file in a new editor tab.

## Creating sections inside a note

Currently extension supports two section types: meta section and infomap section. To create a section, use following syntax:

```
:::<section_name>
<section_content>
:::
```

### Metadata section

Metadata section can contain useful information about the note itself, like author's name, source link, tags, etc. It's section name is `meta` and this section doesn't render in the markdown preview pane. 

### Infomap section

Use of this section provides the capability to combine many other notes into the current one and to present them as a formatted two-column table with note titles in the left column and notes content in the right one. Here is an example of such a section:

```
:::infomap
[Note title 1](include(z:1507952069244))
[Some additional info](include(z:1507952081976))
[And here is some more](include(z:1507952107484))
:::
```


## Additional Markdown syntax

This extension uses some additional `markdown-it` plugins to provide new elements, such as subscript or Latex math formulas. Here are the examples:

![](https://github.com/nergal-perm/zettelkasten-vscode/raw/master/extended-md.png)

### Used markdown plugins

* [markdown-it-sup](https://www.npmjs.com/package/markdown-it-sup)
* [markdown-it-sub](https://www.npmjs.com/package/markdown-it-sub) 
* [markdown-it-footnote](https://www.npmjs.com/package/markdown-it-footnote)
* [markdown-it-container](https://www.npmjs.com/package/markdown-it-container)
* [markdown-it-katex](https://www.npmjs.com/package/markdown-it-katex)

## Credits

Logo image is created by [Aha-soft](http://www.aha-soft.com/) under [CC Attribution-Share Alike 4.0](http://creativecommons.org/licenses/by-sa/4.0/)

Markdown preview code, notes inclusion code is based on [Extensible Markdown Converter](https://github.com/SAKryukov/vscode-markdown-to-html) extension written and maintained by [Sergey Kryukov](http://www.sakryukov.org/)