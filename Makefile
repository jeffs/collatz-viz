.PHONY: test
test: open

.PHONY: open
open: index.html
	open -a Safari index.html
