import React, { useEffect } from 'react'
import './tasktable.css'
import useCountdown from '../../hooks/useCountdown'

const TaskTable = ({ data }) => {
  return (
    <div className='JDSS_TaskTable'>
    <table>
      <thead>
        <tr>
          <th>Requested Name</th>
          <th>Availability Time</th>
          <th>Remaining Time</th>
          <th style={{ textAlign: 'center' }}>Status</th>
        </tr>
      </thead>
      <tbody>
      {data.map((task) => (
        <TaskRow key={task.snipe_name} task={task}/>
      ))}
        <tr style={{ height: '100%' }}></tr>
      </tbody>
    </table>
  </div>
  )
}

function TaskRow({ task }) {
  const { dateTime, start, stop} = useCountdown();
  useEffect(() => {
    start(task.availability_millis);
    return () => stop();
  }, []);
  return (
    <tr key={task.snipe_name}>
      <td>{task.snipe_name}</td>
      <td>{formatTimeWithMilliseconds(new Date(task.availability_millis))}</td>
      <td>{dateTime}</td>
      <td style={{ textAlign: 'center' }}>{task.status}</td>
    </tr>
  );
}

function formatTimeWithMilliseconds(date) {
  // const hours = String(date.getUTCHours()).padStart(2, '0');
  // const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  // const seconds = String(date.getUTCSeconds()).padStart(2, '0');
  // const milliseconds = String(date.getUTCMilliseconds()).padStart(3, '0');
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-based, so add 1
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  const hours12 = hours % 12 || 12;
  const ampm = hours >= 12 ? "PM" : "AM";
  //return `${hours}:${minutes}:${seconds}:${milliseconds}`;
  return `${month}/${day}/${year} ${hours12}:${minutes}:${seconds} ${ampm}`;
}

export default TaskTable