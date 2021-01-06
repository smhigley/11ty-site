---
title: Examples for grid semantics post
---

<style type="text/css">
.table-wrapper {
  overflow: inherit;
}
.table {
  width: 100%;
}
.tr {
  display: flex;
}
.tr > input[type=checkbox] {
  flex: 0 0 1em;
  margin: 0 0.5em;
}

.selection-table .td:first-child {
  display: flex;
  flex: 0 0 2em;
  padding: 0.5em;
}

.selection-table .td:first-child input {
  width: 1em;
}

.th {
  font-weight: bold;
}

.tr .td,
.tr .th {
  flex: 1;
}
</style>

# Grid semantics examples

This page contains supplementary examples for the [Grids part 2: Semantics](/writing/grids-part2) blog post.

## Basic table

A palette cleanser and example of a normal table using normal table elements.

<div class="table-wrapper">
  <table class="table" aria-label="Animals at the Seattle Aquarium: basic example">
    <tr>
      <th>Species</th>
      <th>Number</th>
      <th>Type</th>
    </tr>
    <tr>
      <td>Sea Otter</td>
      <td>3</td>
      <td>Mammal</td>
    </tr>
    <tr>
      <td>River Otter</td>
      <td>2</td>
      <td>Mammal</td>
    </tr>
    <tr>
      <td>Harbor Seal</td>
      <td>3</td>
      <td>Mammal</td>
    </tr>
  </table>
</div>

## Example 1: non-table nodes

<div class="table-wrapper">
  <div role="table" class="table selection-table" aria-label="Animals at the Seattle Aquarium: broken semantics">
    <div role="row" class="tr">
      <input type="checkbox" class="row-selection" aria-label="select all rows">
      <div role="columnheader" class="th">Species</div>
      <div role="columnheader" class="th">Number</div>
    </div>
    <div role="row" class="tr">
      <input type="checkbox" class="row-selection" aria-label="select sea otter row">
      <section class="animal-cell td">
        <div role="cell">Sea Otter</div>
      </section>
      <div role="cell" class="td">3</div>
    </div>
    <div role="row" class="tr">
      <input type="checkbox" class="row-selection" aria-label="select river otter row">
      <section class="animal-cell td">
        <div role="cell">River Otter</div>
      </section>
      <div role="cell" class="td">2</div>
    </div>
    <div role="row" class="tr">
      <input type="checkbox" class="row-selection" aria-label="select harbor seal row">
      <section class="animal-cell td">
        <div role="cell">Harbor Seal</div>
      </section>
      <div role="cell" class="td">3</div>
    </div>
  </div>
</div>

## Example 1, fixed

Note: there are obviously better ways to fix this table code, e.g. by rewriting it with `<table>` elements, or at minimum just removing the extra `<section>` element. This is just an exercise in repairing the table's semantics with as few HTML changes as possible.

<div class="table-wrapper">
  <div role="table" class="table selection-table" aria-label="Animals at the Seattle Aquarium: fixed semantics">
    <div role="row" class="tr">
      <div role="columnheader" class="td">
        <input type="checkbox" class="row-selection" aria-label="select all rows">
      </div>
      <div role="columnheader" class="th">Species</div>
      <div role="columnheader" class="th">Number</div>
    </div>
    <div role="row" class="tr">
      <div role="cell" class="td">
        <input type="checkbox" class="row-selection" aria-label="select sea otter row">
      </div>
      <section class="animal-cell td" role="presentation">
        <div role="cell">Sea Otter</div>
      </section>
      <div role="cell" class="td">3</div>
    </div>
    <div role="row" class="tr">
      <div role="cell" class="td">
        <input type="checkbox" class="row-selection" aria-label="select river otter row">
      </div>
      <section class="animal-cell td" role="presentation">
        <div role="cell">River Otter</div>
      </section>
      <div role="cell" class="td">2</div>
    </div>
    <div role="row" class="tr">
      <div role="cell" class="td">
        <input type="checkbox" class="row-selection" aria-label="select harbor seal row">
      </div>
      <section class="animal-cell td" role="presentation">
        <div role="cell">Harbor Seal</div>
      </section>
      <div role="cell" class="td">3</div>
    </div>
  </div>
</div>


## Multi-column header example

<div class="table-wrapper" style="min-width: 455px">
  <div role="table" class="table" aria-label="Animals at the Seattle Aquarium: complex header example">
    <div role="row" class="tr">
      <div role="columnheader" aria-colspan="2" class="th">Animal</div>
      <div role="columnheader" aria-colspan="2" class="th">Tracking</div>
    </div>
    <div role="row" class="tr">
      <div role="columnheader" class="th">Species</div>
      <div role="columnheader" class="th">Type</div>
      <div role="columnheader" class="th">Number</div>
      <div role="columnheader" class="th">Location</div>
    </div>
    <div role="row" class="tr">
      <div role="cell" class="td">Sea Otter</div>
      <div role="cell" class="td">Mammal</div>
      <div role="cell" class="td">3</div>
      <div role="cell" class="td">Main level</div>
    </div>
    <div role="row" class="tr">
        <div role="cell" class="td">River Otter</div>
        <div role="cell" class="td">Mammal</div>
      <div role="cell" class="td">2</div>
      <div role="cell" class="td">Pier 60</div>
    </div>
    <div role="row" class="tr">
      <div role="cell" class="td">Harbor Seal</div>
      <div role="cell" class="td">Mammal</div>
      <div role="cell" class="td">3</div>
      <div role="cell" class="td">Main level</div>
    </div>
  </div>
</div>

## Example 2: out-of-order rows

<div class="table-wrapper">
  <div role="table" class="table selection-table" aria-label="Animals at the Seattle Aquarium: out-of-order example" aria-rowcount="100" style="display: flex; flex-direction: column;">
    <div role="row" class="tr" aria-rowindex="1">
      <div role="columnheader" class="td">
        <input type="checkbox" class="row-selection" aria-label="select all rows">
      </div>
      <div role="columnheader" class="td">Animal type</div>
      <div role="columnheader" class="td">Number</div>
    </div>
    <div role="row" class="tr" aria-rowindex="7" style="order: 3">
      <div role="cell" class="td">
        <input type="checkbox" class="row-selection" aria-label="select sea otter row">
      </div>
      <div role="cell" class="td">River Otter</div>
      <div role="cell" class="td">2</div>
    </div>
    <div role="row" class="tr" aria-rowindex="6" style="order: 2">
      <div role="cell" class="td">
        <input type="checkbox" class="row-selection" aria-label="select river otter row">
      </div>
      <div role="cell" class="td">Sea Otter</div>
      <div role="cell" class="td">3</div>
    </div>
    <div role="row" class="tr" aria-rowindex="8" style="order: 4">
      <div role="cell" class="td">
        <input type="checkbox" class="row-selection" aria-label="select harbor seal row">
      </div>
      <div role="cell" class="td">Harbor Seal</div>
      <div role="cell" class="td">3</div>
    </div>
  </div>
</div>

There is no "fixed" version of this table, since the only fix is to re-order the HTML.
