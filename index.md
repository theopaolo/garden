---
layout: base.njk
title: Home
---

# Welcome to My Digital Garden

This is where I share my thoughts, notes, and ideas. Feel free to explore!

## Recent Notes

{%- for note in collections.notes | reverse -%}
<div class="note">
    <h2><a href="{{ note.url }}">{{ note.data.title }}</a></h2>
    <div class="note-date">{{ note.date | date: "%Y-%m-%d" }}</div>
    <p>{{ note.data.description }}</p>
</div>
{%- endfor -%}