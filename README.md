# collatz-viz

[Run in your browser]( https://jeffs.github.io/collatz-viz/ )

In 1937, Lothar Collatz conjectured that if you start with any positive integer
n, halve it if it’s even or triple and increment it if it’s odd, and repeat ad infinitum,
you’ll eventually reach the number 1.  For example, suppose we start with 42:

     42 / 2     = 21
     21 * 3 + 1 = 64
     32 / 2     = 16
     16 / 2     =  8
      8 / 2     =  4
      4 / 2     =  2
      2 / 1     =  1

It took us six hops, so this Collatz path (from 42 to 1) has length six.  The
code in this repo plots such paths on one chart, and their lengths on another.
I wrote this purely to see whether any visually interesting patterns emerged.
(They do, IMO.)
