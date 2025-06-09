import React, { useState, useEffect, Fragment } from 'react';
import { ManualScheduleService } from '../../Services/ManualScheduleService';
import { Button, Table, Input, Modal } from 'semantic-ui-react';
import { useNavigate } from 'react-router-dom';
import { CourseLecturesModel } from '../../Interfaces/CourseLecturesModel';
import { GroupModel } from '../../Interfaces/GroupModel';
import { HallModel } from '../../Interfaces/HallModel';
import { LocationModel } from '../../Interfaces/LocationModel';
import { DepartmentModel } from '../../Interfaces/DepartmentModel';
import { CourseLecturesService } from '../../Services/CourseLecturesService';
import { GroupService } from '../../Services/GroupService';
import { HallService } from '../../Services/HallService';
import { LocationService } from '../../Services/LocationService';
import { DepartmentService } from '../../Services/DepartmentService';

export default function RaportetAnuluara() {
  const [canceledSchedules, setCanceledSchedules] = useState<any[]>([]);
  const [filteredSchedules, setFilteredSchedules] = useState<any[]>([]);
  const [courseLecturesList, setCourseLecturesList] = useState<CourseLecturesModel[]>([]);
  const [groupsList, setGroupsList] = useState<GroupModel[]>([]);
  const [hallsList, setHallsList] = useState<HallModel[]>([]);
  const [locationsList, setLocationsList] = useState<LocationModel[]>([]);
  const [departmentsList, setDepartmentsList] = useState<DepartmentModel[]>([]);
  const daysOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const [searchTerm, setSearchTerm] = useState('');
  const [openConfirm, setOpenConfirm] = useState(false);
  const [selectedId, setSelectedId] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCanceledSchedules = async () => {
      const result = await ManualScheduleService.GetCanceledSchedules();
      const sorted = result.slice().sort((a, b) => {
      const dayComparison = daysOrder.indexOf(a.day) - daysOrder.indexOf(b.day);
      if (dayComparison !== 0) return dayComparison;
      if (a.startTime < b.startTime) return -1;
      if (a.startTime > b.startTime) return 1;
      return 0;
      });
      setCanceledSchedules(sorted);
      setFilteredSchedules(sorted);
      };
    fetchCanceledSchedules();
  }, []);

  useEffect(() => {
          let fetched = false;
          const fetchAll = async () => {
              try 
              {
                  const [cLR, gR, hR, lR, dR] = await Promise.all([
                      CourseLecturesService.GetSelectList(),
                      GroupService.GetSelectList(),
                      HallService.GetSelectList(),
                      LocationService.GetSelectList(),
                      DepartmentService.GetSelectList(),
                  ]);
                  if (!fetched)
                  {
                      setCourseLecturesList(cLR);
                      setGroupsList(gR);
                      setHallsList(hR);
                      setLocationsList(lR);
                      setDepartmentsList(dR);
                  }
              }
              catch (err) 
              {
                  console.error("Lists could not be loaded!", err);
              };
          };
          fetchAll();
          return () => {
              fetched = true;
          };
      }, []);

  useEffect(() => {
    const filtered = canceledSchedules.filter(s =>
      (departmentsList.find(d => d.id === s.departmentId)?.name)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.day?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (groupsList.find(g => g.id === s.groupId)?.name)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (locationsList.find(l => l.id === s.locationId)?.name)?.toLowerCase().includes(searchTerm.toLowerCase())||
      s.startTime?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.endTime?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredSchedules(filtered);
  }, [searchTerm, canceledSchedules]);

  const openModal = (id: string) => {
    setSelectedId(id);
    setOpenConfirm(true);
  };

  const handleRestore = async () => {
    await ManualScheduleService.RestoreSchedule(selectedId);
    const updated = canceledSchedules.filter(s => s.id !== selectedId);
    setCanceledSchedules(updated);
    setFilteredSchedules(updated);
    setOpenConfirm(false);
    setSelectedId('');
  };

  return (
    <Fragment>
      <div className="d-flex align-items-center mt-4 mb-3 px-4">
        <h1 style={{ marginLeft: '30px' }}>Canceled Schedules</h1>
        <Input
          placeholder="Search by day, department, location, group, start or end time"
          style={{ marginLeft: '20px', width: '400px' }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button
          type="button"
          className="ui positive basic button ms-4"
          onClick={() => navigate('/AddTemporarySchedule')}
        >
          Add Temporary Schedule
        </Button>
        <Button
          className="ms-auto"
          color="olive"
          style={{ color: 'white' }}
          onClick={() => navigate('/OrariJavor')}
        >
          Back to Schedule
        </Button>
      </div>

      <div className="px-4">
        <Table striped>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Lecture</Table.HeaderCell>
              <Table.HeaderCell>Day</Table.HeaderCell>
              <Table.HeaderCell>Start</Table.HeaderCell>
              <Table.HeaderCell>End</Table.HeaderCell>
              <Table.HeaderCell>Group</Table.HeaderCell>
              <Table.HeaderCell>Hall</Table.HeaderCell>
              <Table.HeaderCell>Location</Table.HeaderCell>
              <Table.HeaderCell>Department</Table.HeaderCell>
              <Table.HeaderCell>Actions</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {filteredSchedules.map((schedule) => (
              <Table.Row key={schedule.id}>
                <Table.Cell>{courseLecturesList.find(c => c.id === schedule.courseLecturesId)?.name}</Table.Cell>
                <Table.Cell >{schedule.day}</Table.Cell>
                <Table.Cell >{schedule.startTime}</Table.Cell>
                <Table.Cell >{schedule.endTime}</Table.Cell>
                <Table.Cell >{groupsList.find(g => g.id === schedule.groupId)?.name}</Table.Cell>
                <Table.Cell >{hallsList.find(h => h.id === schedule.hallsId)?.name}</Table.Cell>
                <Table.Cell >{locationsList.find(l => l.id === schedule.locationId)?.name}</Table.Cell>
                <Table.Cell >{departmentsList.find(d => d.id === schedule.departmentId)?.name}</Table.Cell>
                <Table.Cell>
                  <Button color="green" onClick={() => openModal(schedule.id)}>
                    Restore
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>

      <Modal
        open={openConfirm}
        size="mini"
        onClose={() => setOpenConfirm(false)}
        closeOnEscape={false}
        closeOnDimmerClick={false}
        style={{
          minHeight: 'unset',
          height: 'auto',
          padding: '1rem',
          textAlign: 'center',
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 1000,
        }}
      >
        <Modal.Content>
          Are you sure you want to restore this schedule?
        </Modal.Content>
        <Modal.Actions style={{ justifyContent: 'center', display: 'flex', gap: '1rem' }}>
          <Button onClick={() => setOpenConfirm(false)}>Cancel</Button>
          <Button color="green" onClick={handleRestore}>Restore</Button>
        </Modal.Actions>
      </Modal>
    </Fragment>
  );
}
