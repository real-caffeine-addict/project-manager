# Raw HTML Safety Test

This paragraph contains raw HTML-like text: <strong>do not render me</strong>.

<div>
This raw HTML block should not be rendered as HTML.
</div>

<script>
alert("This must never execute");
</script>

## Normal Section

This text should remain editable as a normal paragraph.
