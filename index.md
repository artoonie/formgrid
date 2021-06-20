---
layout: default
---
{% capture deps %}{% include_relative docs/deps.html %}{% endcapture %}
{{ deps }}

# Formgrid
Create an expandable 2D grid of inputs with a user-controllable number of rows and columns.

# Basic
{% capture ex0 %}{% include_relative docs/example-0-teaser.html %}{% endcapture %}
{{ ex0 }}

# Building locally

The widgets are built with various configurations as examples. They can be tested locally with Jekyll:

```bash
bundle exec jekyll serve
```

And the tests can be run with:
```bash
npm run test
```

The readme and github page share a source. Both index.md and README.md are generated via:
```bash
python3 docs/generate-readme.py
```
