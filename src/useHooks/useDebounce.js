import {useRef} from 'react';

function useDebounce(props) {
  const [ callback, delay ] = props;
  const timeOut = useRef(null);

  function debounced() {
    clearTimeout(timeOut.current);
    timeOut.current = setTimeout((...args) => {
      callback.apply(this, args);
    }, delay);
  }

  return [debounced];
}

export default useDebounce;
