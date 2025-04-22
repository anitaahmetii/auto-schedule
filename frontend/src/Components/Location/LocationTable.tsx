import React, { Fragment, useEffect, useState } from "react";
import {
  Table,
  Button,
  TableHeader,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
  Confirm,
} from "semantic-ui-react";
import { useNavigate } from "react-router-dom";
import { LocationModel } from "../../Interfaces/LocationModel";
import { LocationService } from "../../Services/LocationService";

export default function LocationTable() {
  const [locations, setLocations] = useState<LocationModel[]>([]);
  const [openConfirm, setOpenConfirm] = useState<boolean>(false);
  const [deleteLocationId, setDeleteLocationId] = useState<string>("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const result = await LocationService.GetAllLocations();
      setLocations(result);
    };
    fetchData();
  }, []);

  function deleteLocation(id: string) {
    setOpenConfirm(true);
    setDeleteLocationId(id);
  }

  async function confirmedDeleteLocation(id: string) {
   var result = await LocationService.DeleteLocation(id);
    setLocations(locations.filter((location) => location.id !== id));
    setOpenConfirm(false);
    setDeleteLocationId("");
  }

  function sendToDetails(id: string | null) {
    navigate(`/EditLocation/${id}`);
  }

  function AddLocation() {
    navigate(`/AddLocation`);
  }

  return (
    <Fragment>
      <div className="mt-5 d-flex align-items-center">
        <h1 style={{ marginLeft: "30px" }}>Locations</h1>
        <Button
          type="button"
          className="ui positive basic button ms-4"
          onClick={()=>AddLocation()}
        >
          Add New Location
        </Button>
        <div className="col-12 col-sm-8 col-md-6 col-lg-4 col-xl-3">
        </div>
        </div>
      <Table striped>
        <TableHeader>
          <TableRow>
            <TableHeaderCell>Name</TableHeaderCell>
            <TableHeaderCell>City</TableHeaderCell>
            <TableHeaderCell>StreetNo</TableHeaderCell>
            <TableHeaderCell>ZipCode</TableHeaderCell>
            <TableHeaderCell>Phone Number</TableHeaderCell>
            <TableHeaderCell>Actions</TableHeaderCell>
          </TableRow>
        </TableHeader>

        <TableBody>
          {locations.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.city}</TableCell>
              <TableCell>{item.streetNo}</TableCell>
              <TableCell>{item.zipCode}</TableCell>
              <TableCell>{item.phoneNumber}</TableCell>
              <TableCell>
                <Button
                  type="button"
                  className="btn ui green basic button"
                  onClick={() => sendToDetails(item.id!)}
                >
                  Edit
                </Button>
                <Button
                  type="button"
                  className="btn btn-danger"
                  negative
                  onClick={() => deleteLocation(item.id!)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Confirm
        open={openConfirm}
        onCancel={() => setOpenConfirm(false)}
        onConfirm={() => confirmedDeleteLocation(deleteLocationId)}
      />
    </Fragment>
  );
}
