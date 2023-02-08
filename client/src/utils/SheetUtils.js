import axios from "axios";
import { SheetForm } from "../components/Rows";

const handleSubmit = async (sheetArr, userId) => {
  const submitArr = sheetArr.map((innerArr) => {
    return innerArr.map((props) => {
      if (props.value === null) {
        return 0;
      } else {
        return props.value;
      }
    });
  });
  const newSubArr = submitArr.filter((props) => {
    return (props.reduce((cnt, elem) =>
      cnt + (elem === undefined || elem === null || elem === 0), 0) < 14);
  })

  try {
    const result = await axios.post(`/api/excel`, {
      data: {
        id: userId,
        form: newSubArr
      }
    })
    alert(result.data[0].data);
  } catch (err) {
    console.error(err)
  };
}

const defaultCellChecker = (arr, setter) => {
  if (arr.length < 19) {
    const arrCount = 19 - arr.length;
    if (arrCount >= 0) {
      for (let i = 0; i < arrCount; i++) {
        setter(prev => [...prev, SheetForm[0]]);
      }
    }
  }
}

const mapper = (resArr) => {
  const resultArr = resArr.map(props => {
    const result = [];
    for (let keys in props) {
      result.push({ value: props[keys], readOnly: true })
    }
    return result;
  })
  return resultArr;
}


const handleGetData = async (setter, userId) => {
  setter([]);
  if (userId === 'admin') {
    try {
      const result = await axios.get(`/api/allExcel`)
      const resData = result.data[0].data;
      const newResData = mapper(resData);
      setter(newResData);
      defaultCellChecker(newResData, setter);
    } catch (err) {
      console.error(err);
    }
    return;
  } else if (userId === 'admin' && userId) {
    const result = await axios.get(`/api/excel?agency=${userId}`);
    const resData = result.data[0].data;
    const newResData = mapper(resData);
    setter(newResData);
    defaultCellChecker(newResData, setter);
    return;
  } else {
    try {
      const result = await axios.get(`/api/excel?agency=${userId}`)
      const resData = result.data[0].data;
      console.log('1 : ', resData);
      console.log('2 : ', result.data);
      const newResData = mapper(resData);
      console.log(newResData);
      setter(newResData);
      defaultCellChecker(newResData, setter);
    } catch (err) {
      console.error(err);
    }
    return;
  }
}

const handleOnClick = (setter, ref) => {
  setter([]);
  ref.current.value = '';
  ref.current.click();
}

export { handleSubmit, handleGetData, defaultCellChecker, mapper, handleOnClick };