Trying to fix, update, expand upon Junior Phase Final Project

Major fix to make sure pages were re rendering without page refreshes, which involved making sure useEffect was keying off of variables that changed with db updates.

Other fixes for interactivity - like making sure campus Info tabs scrolled back into view when their associated campus was highlighted on the map.  This involved adding a ref={useRef()} to each relevant div and then running: ref.current.getBoundingClientRect() which gives us the actual coordinates of the div so we can decide whether to run window.scrollTo if it is offscreen due to being scrolled out of view when there are too many campuses to fit vertically


