import Login from "./pages/Login/login";
import "./App.css";

import { Route, Routes } from "react-router-dom";
import AuthContextProvider from "./store/authcontext";

import Home from "./pages/Home/Home";
import Update from "./pages/Agent/Update";
import CreateAgent from "./pages/Agent/Create";
import Orders from "./pages/orders/Orders";
import OrderDetailPage from "./pages/orders/Ordersdetail";
import CreateProduct from "./pages/Products/Create";
import ProductList from "./pages/Products/List";
import ProductDetail from "./pages/Products/Productdetail";
import LiveOrders from "./pages/orders/LiveOrders";
import Create from "./pages/Services/Create";
import List from "./pages/Services/List";
import DropsHome from "./pages/Drops/Home";
import DropsCreate from "./pages/Drops/Create";
import DropDetail from "./pages/Drops/Detail";
import DropsProductDetail from "./pages/Drops/ProductDetail";
import DropsCreateProduct from "./pages/Drops/CreateProduct";

import Requireauth from "./Requireauth";

function App() {
  return (
    <div>
      <AuthContextProvider>
        <Routes>
          <Route path="/auth" element={<Login />}></Route>

          <Route
            path="/"
            element={
              <Requireauth>
                <Home />
              </Requireauth>
            }
          ></Route>
          <Route path="/Product">
            <Route
              path="create"
              element={
                <Requireauth>
                  <CreateProduct></CreateProduct>
                </Requireauth>
              }
            />
            <Route
              path="list"
              element={
                <Requireauth>
                  <ProductList></ProductList>
                </Requireauth>
              }
            />
            <Route path=":productId" element={<ProductDetail />} />
          </Route>
          <Route path="/agent">
            <Route
              path="update"
              element={
                <Requireauth>
                  <Update />
                </Requireauth>
              }
            />
            <Route
              path="create"
              element={
                <Requireauth>
                  <CreateAgent />
                </Requireauth>
              }
            />
          </Route>
          <Route path="/Service">
            <Route path="List" element={<List></List>} />
            <Route path="create" element={<Create></Create>} />
          </Route>
          <Route path="/orders">
            <Route
              path="list"
              element={
                <Requireauth>
                  <Orders></Orders>
                </Requireauth>
              }
            />
            <Route path="detail/:orderId" element={<OrderDetailPage />} />
            <Route
              path="Live/:Status/:startDate/:endDate/:zone"
              element={<LiveOrders />}
            />
          </Route>
          <Route path="/drops">
            <Route path="Home" element={<DropsHome></DropsHome>} />
            <Route path="create" element={<DropsCreate></DropsCreate>} />
            <Route path=":dropId" element={<DropDetail></DropDetail>}></Route>
            <Route
              path=":dropId/:collection/:productId"
              element={<DropsProductDetail></DropsProductDetail>}
            ></Route>
            <Route
              path=":dropId/:collection/create"
              element={<DropsCreateProduct></DropsCreateProduct>}
            ></Route>
          </Route>
        </Routes>
      </AuthContextProvider>
    </div>
  );
}

export default App;
