import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Button } from "semantic-ui-react";
import { ScheduleTypeModel, ScheduleTypes } from "../../Interfaces/ScheduleTypeModel";
import { ScheduleTypeService } from "../../Services/ScheduleTypeService";

export default function EditScheduleType() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [scheduleType, setScheduleType] = useState<ScheduleTypeModel>({
    id: null,
    scheduleTypes: null,
    userId: null,
  });

  // Marrja e të dhënave për edit nëse ka ID
  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        const result = await ScheduleTypeService.GetScheduleTypeDetails(id);        
        setScheduleType(result);
      };
      fetchData();
    }
  }, [id]);

  // Opsionet për dropdown
  const scheduleTypeOptions = Object.values(ScheduleTypes).map((type) => ({
    key: type,
    text: type,
    value: type,
  }));

  // Submit (edit ose add)
  const handleSubmit = async () => {
    // Përdorim scheduleType dhe jo model
    await ScheduleTypeService.EditOrAddScheduleType(scheduleType);
    navigate("/scheduleType");
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Select
        label="Schedule Type"
        options={scheduleTypeOptions}
        value={scheduleType.scheduleTypes ?? ""}
        onChange={(e, { value }) =>
          setScheduleType({ ...scheduleType, scheduleTypes: value as ScheduleTypes })
        }
        placeholder="Select Schedule Type"
        required
      />

      <Button type="submit" positive>
        {scheduleType.id ? "Update" : "Add"} Schedule Type
      </Button>
    </Form>
  );
}
