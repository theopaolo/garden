---
layout: base.njk
title: All Notes
---

# All Notes

{% for note in collections.notes | reverse %}
<div class="note">
    <h2><a href="{{ note.url }}">{{ note.data.title }}</a></h2>
    <div class="note-date">{{ note.date | date: "%Y-%m-%d" }}</div>

    {% if note.data.description %}
        <p>{{ note.data.description }}</p>
    {% endif %}
</div>
{% endfor %}