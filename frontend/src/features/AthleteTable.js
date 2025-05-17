import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function AthleteTable() {
  const [athletes, setAthletes] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/athletes')
      .then(res => setAthletes(res.data))
      .catch(err => console.error('Error:', err));
  }, []);

  return (
    <div className="table-responsive">
      <h4 className="my-3">Athletes</h4>
      <table className="table table-striped table-bordered">
        <thead className="table-dark">
          <tr>
            <th>Name</th>
            <th>Nationality</th>
            <th>Sport</th>
            <th>Discipline</th>
            <th>Gender</th>
          </tr>
        </thead>
        <tbody>
          {athletes.slice(0, 50).map((athlete, i) => (
            <tr key={i}>
              <td>{athlete.name}</td>
              <td>{athlete.nationality}</td>
              <td>{athlete.sport}</td>
              <td>{athlete.discipline}</td>
              <td>{athlete.sex}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
