//todo add task to list, create task, delete task

const SETALLTASKS = 'tasks/ALL';
const SETSINGLETASK = 'tasks/SINGLE';
const CREATETASK = 'tasks/CREATE';
const UPDATETASKNAME = 'tasks/UPDATENAME';
const UPDATECOMPLETESTATUS = 'tasks/UPDATECOMPLETE';
const DELETETASK = 'tasks/DELETE';

const allTasks1 = (arr) => {
  return {
    type: SETALLTASKS,
    arr
  };
};

const singleTask1 = (obj) => {
  return {
    type: SETSINGLETASK,
    obj
  };
};


const renameTask1 = (obj) => {
  return {
    type: UPDATETASKNAME,
    obj
  };
};

const updateCompleteStatus1 = (obj) => {
  return {
    type: UPDATECOMPLETESTATUS,
    obj
  };
};

const createTask1 = (obj) => {
  return {
    type: CREATETASK,
    obj
  };
};

const deleteTask1 = (taskId) => {
  return {
    type: DELETETASK,
    taskId
  };
};


// thunk
export const allTasks = () => async (dispatch) => {
  const response = await csrfFetch(`/api/tasks/all`)
  if (response.ok) {
    const data = await response.json();
    dispatch(allTasks1(data));
  };
  return response
};

export const singleTask = (taskId) => async (dispatch) => {
  const response = await csrfFetch(`/api/tasks/${taskId}`)
  if (response.ok) {
    const data = await response.json();
    dispatch(singleTask1(data));
  };
  return response
};

export const createTask = (formData) => async (dispatch) => {
  const response = await csrfFetch(`/api/tasks`, {
    method: 'POST',
    body: JSON.stringify(formData)
  })
  if (response.ok) {
    const data = await response.json();
    dispatch(createTask1(data));
    dispatch(singleTask1(taskId))
  };
  return response
};

export const renameTask = (taskId, formData) => async (dispatch) => {
  const response = await csrfFetch(`/api/tasks/${taskId}`, {
    method: 'PUT',
    body: JSON.stringify(formData)
  })
  if (response.ok) {
    const data = await response.json();
    dispatch(renameTask1(data));
    dispatch(singleTask1(taskId))
  };
  return response
};

export const changeCompleteStatus = (taskId) => async (dispatch) => {
  const response = await csrfFetch(`/api/tasks/${taskId}/completed`, {
    method: 'PUT'
  })
  if (response.ok) {
    const data = await response.json();
    dispatch(updateCompleteStatus1(data));
    dispatch(singleTask1(taskId))
  };
  return response
};

export const deleteTask = (taskId) => async (dispatch) => {
  const response = await csrfFetch(`/api/tasks/${taskId}`, {
    method: 'DELETE'
  })
  if (response.ok) {
    const data = await response.json();
    dispatch(deleteTask1(taskId));
  };
  return response
};


const initialState = {
  allTasks: {},
  singleTask: {}
};

const tasksReducer = (state = initialState, action) => {
  switch (action.type) {
    case SETALLTASKS:
      let newState1 = { singleTask: { ...state.allTasks }, allTasks: {} };
      action.arr.forEach(s => newState1.allTasks[s.id] = s);
      return newState1;
    case SETSINGLETASK:
      // we do not know if task.list will copy or not... if problems arise we can adjust
      let newState2 = { allTasks: { ...state.allTasks }, singleTask: {} };
      newState2.singleTask = { ...action.obj };
      return newState2;
    case UPDATETASKNAME:
      let newState3 = { allTasks: { ...state.allTasks }, singleTask: {} };
      let task1 = action.obj
      newState3.allTasks[task1.id] = { ...task1 };
      return newState3
    case UPDATECOMPLETESTATUS:
      let newState4 = { allTasks: { ...state.allTasks }, singleTask: {} };
      let task2 = action.obj
      newState4.allTasks[task2.id] = { ...task2 };
      return newState4
    case CREATETASK:
      let newState5 = { allTasks: { ...state.allTasks }, singleTask: {} };
      let task3 = action.obj
      newState5.allTasks[task3.id] = { ...task3 };
      return newState5
    case DELETETASK:
      let newState6 = { allTasks: { ...state.allTasks }, singleTask: {...state.allTasks} };
      let task4 = action.taskId
      delete newState6.allTasks[task4.id]
      if (newState6.singleTask.id == task4.id) newState6.singleTask = {}
      return newState6

    default:
      return state;
  }
};

export default tasksReducer;
