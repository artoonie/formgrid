---
layout: default
---
{% capture deps %}{% include_relative docs/deps.html %}{% endcapture %}
{{ deps }}

{% capture ex0 %}{% include_relative docs/example-0-teaser.html %}{% endcapture %}
{{ ex0 }}

# Formgrid
Create an expandable 2D grid of inputs with a user-controllable number of rows and columns.
