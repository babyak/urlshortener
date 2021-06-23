import { Admin, Resource, ListGuesser, fetchUtils, Filter, TextInput, List, Datagrid, TextField, DateField } from 'react-admin';
import jsonServerProvider from 'ra-data-json-server';

const API_KEY = '48debf4d-b5b4-4c9d-98ab-7e2494228538'

const fetchJson = (url: string, options: any = {}) => {
  if (!options.headers) {
    options.headers = new Headers({ Accept: 'application/json' })
  }

  options.headers.set('x-api-key', API_KEY)

  return fetchUtils.fetchJson(url, options);
}

const dataProvider = jsonServerProvider('http://localhost:3000', fetchJson);

const UrlFilter = (props: any) => (
  <Filter {...props}>
    <TextInput label="Search by code" source="keywordCode" alwaysOn />
    <TextInput label="Search by original url" source="keywordUrl" alwaysOn />
</Filter>
);

const UrlList = (props: any) => (
  <List {...props} filters={<UrlFilter />} >
      <Datagrid>
          <TextField source="id" />
          <TextField source="originalUrl" />
          <TextField source="code" />
          <TextField source="hits" />
          <DateField source="expiry" />
      </Datagrid>
  </List>
);

const AdminPage = () => (
  <Admin dataProvider={dataProvider}>
    <Resource name="urls" list={UrlList} />
  </Admin>
)

export default AdminPage;
