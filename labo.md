---
layout: note.njk
title: Laboratory Notes
description: Collection of experimental and research notes
---

# Laboratory Notes

{% for note in collections.laboNotes | reverse %}
<div class="note">
    <h2><a href="{{ note.url }}">{{ note.data.title }}</a></h2>
    <div class="note-date">{{ note.date | date: "%Y-%m-%d" }}</div>
    <p>{{ note.data.description }}</p>
</div>
{% endfor %}