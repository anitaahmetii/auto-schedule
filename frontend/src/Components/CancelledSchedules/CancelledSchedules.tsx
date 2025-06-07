import React, { useState, useEffect, Fragment } from 'react';
import { ManualScheduleService } from '../../Services/ManualScheduleService';
import { Button, Table, Input, Modal } from 'semantic-ui-react';
import { useNavigate } from 'react-router-dom';

export default function RaportetAnuluara() {
  const [canceledSchedules, setCanceledSchedules] = useState<any[]>([]);
  const [filteredSchedules, setFilteredSchedules] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [openConfirm, setOpenConfirm] = useState(false);
  const [selectedId, setSelectedId] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCanceledSchedules = async () => {
      const result = await ManualScheduleService.GetCanceledSchedules();
      setCanceledSchedules(result);
      setFilteredSchedules(result);
    };
    fetchCanceledSchedules();
  }, []);

  useEffect(() => {
    const filtered = canceledSchedules.filter(s =>
      s.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.day?.toLowerCase().includes(searchTerm.toLowerCase())
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
          placeholder="Search by day or department..."
          style={{ marginLeft: '20px', width: '250px' }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button
          color="blue"
          style={{ marginLeft: '20px' }}
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
        <Table className="ui olive single line table">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Day</Table.HeaderCell>
              <Table.HeaderCell>Department</Table.HeaderCell>
              <Table.HeaderCell>Reason</Table.HeaderCell>
              <Table.HeaderCell>Actions</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {filteredSchedules.map((schedule) => (
              <Table.Row key={schedule.id}>
                <Table.Cell>{schedule.day}</Table.Cell>
                <Table.Cell>{schedule.department}</Table.Cell>
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
