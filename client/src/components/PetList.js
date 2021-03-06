import React, { useEffect, useState } from "react";
import pets from "../pets.json";
import { useDispatch, useSelector } from "react-redux";
import {
  adoptPet,
  unAdoptPet,
  getAdopters,
  initWeb3,
} from "../store/adoptionSlice";

export default function PetList() {
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const { adopters, isLoading, errorMessage, error, address } = useSelector(
    (state) => {
      return state.adoptionReducer;
    }
  );

  useEffect(() => {
    setLoading(true);

    dispatch(initWeb3());

    setTimeout(() => {
      dispatch(getAdopters());

      setLoading(false);
    }, 2000);
  }, []);

  return (
    <div>
      {!loading ? (
        <div>
          <h3>Account:{address}</h3>
          {isLoading ? (
            <img id="overlay" src="images/progress.gif" alt="progress.gif" />
          ) : (
            <div>
              {error ? <p style={{ color: "red" }}>{errorMessage}</p> : null}

              {pets.map((pet) => (
                <div
                  key={pet.id}
                  style={{
                    border: "1px solid black",
                    display: "inline-block",
                    margin: "10px",
                    padding: "20px",
                  }}
                >
                  <h1>{pet.name}</h1>
                  <img src={pet.picture} width="200px" />
                  <div>Age: {pet.age} Years</div>
                  <div>Breed: {pet.breed}</div>
                  <div>Location: {pet.location}</div>
                  <div>Owner: {adopters[pet.id]}</div>

                  {adopters[pet.id] ==
                  "0x0000000000000000000000000000000000000000" ? (
                    <>
                      <button
                        style={{ margin: "10px" }}
                        onClick={() => {
                          dispatch(adoptPet(pet.id));
                        }}
                      >
                        Adopt
                      </button>
                      <button disabled={true}>Un Adopt</button>
                    </>
                  ) : (
                    <>
                      {adopters[pet.id] == address ? (
                        <button onClick={() => dispatch(unAdoptPet(pet.id))}>
                          Un Adopt
                        </button>
                      ) : null}
                      <button disabled={true} style={{ margin: "10px" }}>
                        Already Adopted
                      </button>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <img id="overlay" src="images/progress.gif" alt="progress.gif" />
      )}
    </div>
  );
}
