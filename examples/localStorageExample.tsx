import React from 'react';

const useStateWithLocalStorage = (localStorageKey: string) => {
  const [value, setValue] = React.useState(localStorage.getItem(localStorageKey) || '');

  React.useEffect(() => {
    localStorage.setItem(localStorageKey, value);
  }, [value]);

  return [value, setValue];
};

const App = () => {
  const [value, setValue] = useStateWithLocalStorage('myValueInLocalStorage');

  const onChange = (event: any) => setValue(event.target.value);

  return (
    <div>
      <h1>Hello React with Local Storage!</h1>

      <input value={value} type="text" onChange={onChange} />

      <p>{value}</p>
    </div>
  );
};

export default App;
