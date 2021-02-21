# Óbidos

[![codecov](https://codecov.io/gh/xsanda/obidos/branch/main/graph/badge.svg?token=5WK9ON5B5I)](https://codecov.io/gh/xsanda/obidos)

Óbidos is a work-in-progress web-based clone of the popular board game Carcassonne.
It is named after the walled city of Óbidos in Portugal.

<figure>

![Cityscape of Óbidos](https://user-images.githubusercontent.com/8607022/107149435-78ce0580-6950-11eb-92c4-4ba9ca0dac17.png)

<figcaption>

[Oren Rozen](https://commons.wikimedia.org/wiki/File:Portugal_110716_%C3%93bidos_05.jpg) / [CC-BY-SA-4.0](https://creativecommons.org/licenses/by-sa/4.0/)

</figcaption>

</figure>

## Organisation

The project is handled by yarn as a monorepo with multiple workspaces.
This means that calling `yarn` from anywhere will install all the dependencies for the entire project.
The following workspaces are included:

### [`@obidos/model`](./model/#readme)

This contains the data model for representing the game, and is used by both the server and the client.

### [`@obidos/cli-player`](./cli-player/#readme)

This contains a CLI interface for playing Óbidos.

### [`@obidos/actions`](./actions/#readme)

This contains scripts used for the continuous integration of this repo.
Eventually they wil be released as full GitHub Actions steps, but for now they are only used here.
