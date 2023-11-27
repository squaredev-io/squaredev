const apikey_example = {
  id: '9365c17f-e2f4-4350-a898-1a0e9a025c35',
  created_datetime: '2023-11-27T16:40:33.726536',
  modified_datetime: '2023-11-27T16:40:33.726546',
  key: 'sqd_d230165c2677f7a35ce7de909ed11a85',
  is_active: true,
  user_id: '95c0c908-c92a-49fa-afc2-15d522158891',
  name: 'Test',
};

export interface ApiKey {
  id: string;
  created_datetime: string;
  modified_datetime: string;
  key: string;
  is_active: boolean;
  user_id: string;
  name: string;
}
