# PAVE

#### PATIENT ACCESS VISUALISATION ENGINE
A visualisation tool to illustrate how people act with different healthcare services in Bristol. PAVE Capacity displays a map of capacity of a service against demand. PAVE Flow maps how people are referred between different healthcare services. Follow the links to see it in action: [PAVE Capacity Visualisation](https://davehenryjones.github.io/pave/) | [PAVE Flow Visualisation](https://davehenryjones.github.io/patient-flow/)

>NOTE: The data used in this demo is purely for illustrative purposes and does not reflect real healthcare data.

### Running this code

Run your own local server such as Node or Apache2 with the root directory as `/src/public`.

With a standard configuration
- PAVE Capacity will be located at `http://localhost:8080/capacity-modelling/`
- PAVE Flow will be located at `http://localhost:8080/patient-flow/`

>NOTE: Other folders and files are the in-development website surrounding the different visualisations. They are not needed to view the visualisations.

### Latest Release - v0.2.0

  - Displays local services in correct position on map
  - PAVE Capacity displays capacity and demand for different services.
  - PAVE Capacity can display data across several days.
  - PAVE Flow displays referrals across healthcare services.
  - PAVE Flow can be customised and filtered using the side menu.
  - PAVE Flow uses URL encoding so views of the visualisation can be saved by the user.

> PAVE Capacity
> ![PAVE Capacity visualisation](/docs/resources/capacity.png)
> Dummy capacity vs admission data (for illustrative purposes only)

> PAVE Flow
> ![PAVE Flow visualisation](/docs/resources/flow.png)
> Dummy referral data (for illustrative purposes only)
