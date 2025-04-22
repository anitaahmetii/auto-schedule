import React, { Fragment, useEffect, useState } from "react";
import {
  Table,
  Button,
  Input,
  TableHeader,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
  Confirm,
} from "semantic-ui-react";
import { Link, useNavigate } from "react-router-dom";
import { CityModel } from "../../Interfaces/CityModel";
import { CityService } from "../../Services/CityService";

export default function CityTable() {
  const [cities, setCities] = useState<CityModel[]>([]);
  const [openConfirm, setOpenConfirm] = useState<boolean>(false);
  const [deleteCityId, setDeleteCityId] = useState<string>("");
  
  const navigate = useNavigate();
  useEffect(()=>{
    const fetchData = async () => {
      const result = await CityService.GetAllCities();
      setCities(result);
    };
    fetchData();
  }, []);

  function deleteCities(id: string) {
    setOpenConfirm(true);
    setDeleteCityId(id);
  }

  async function confirmedDeleteCity(id: string) {
    var result = await CityService.DeleteCity(id);
    setCities(cities.filter((city) => city.id !== id));
    setOpenConfirm(false);
    setDeleteCityId("");
  }

  function sendToDetails(id:string | null) {
    navigate(`/EditCity/${id}`);
  }

  function AddCity() {
    navigate(`/AddCity`);
  }

  return (
    <Fragment>
      <div className="mt-5 d-flex align-items-center">
        <h1 style={{ marginLeft: "30px" }}>City</h1>
        <Button
          type="button"
          className="ui positive basic button ms-4"
          onClick={() => AddCity()}
        >
          Add New City
        </Button>
        <div className="col-12 col-sm-8 col-md-6 col-lg-4 col-xl-3">
      </div>
      </div>
      <Table striped>
        <TableHeader>
          <TableRow>
          <TableHeaderCell>Name</TableHeaderCell>
          <TableHeaderCell>StateId</TableHeaderCell>
            <TableHeaderCell>Actions</TableHeaderCell>
          </TableRow>
        </TableHeader>

        <TableBody>
          {cities.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.stateId}</TableCell>
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
                  onClick={() => deleteCities(item.id!)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
          <Confirm
            open={openConfirm}
            onCancel={() => setOpenConfirm(false)}
            onConfirm={() => confirmedDeleteCity(deleteCityId!)}
          />
        </TableBody>
      </Table>
    </Fragment>
  );
}
