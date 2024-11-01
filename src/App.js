import React, { useState } from 'react';
import {
  Layout,
  Menu,
  Dropdown,
  Button,
  Radio,
  Input,
  DatePicker,
  Pagination,
  Checkbox,
  List,
  Divider,
} from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';

const { Header, Content, Footer } = Layout;

const App = () => {
  const [widgetType, setWidgetType] = useState('match');
  const [hasChanges, setHasChanges] = useState(false);

  const menu = (
    <Menu>
      <Menu.Item key="reset">Сбросить виджет</Menu.Item>
      <Menu.Item key="delete">Удалить виджет</Menu.Item>
    </Menu>
  );

  const onWidgetTypeChange = (e) => {
    setWidgetType(e.target.value);
    setHasChanges(true);
  };

  const saveAndPublish = () => {
    // Логика сохранения
    setHasChanges(false);
  };

  // Пример данных для лиг, клубов и матчей
  const leaguesData = [
    { key: '1', name: 'Английская Премьер-Лига' },
    { key: '2', name: 'Ла Лига' },
    { key: '3', name: 'Бундеслига' },
    { key: '4', name: 'Серия А' },
    { key: '5', name: 'Лига 1' },
  ];

  const clubsData = [
    { key: '1', name: 'Манчестер Юнайтед' },
    { key: '2', name: 'Реал Мадрид' },
    { key: '3', name: 'Бавария Мюнхен' },
    { key: '4', name: 'Ювентус' },
    { key: '5', name: 'Пари Сен-Жермен' },
    { key: '6', name: 'Барселона' },
  ];

  const matchesData = [
    {
      key: '1',
      teams: 'Манчестер Юнайтед vs Ливерпуль',
      time: '2023-11-01 18:00',
      league: 'Английская Премьер-Лига',
    },
    {
      key: '2',
      teams: 'Барселона vs Реал Мадрид',
      time: '2023-11-02 20:00',
      league: 'Ла Лига',
    },
    {
      key: '3',
      teams: 'Боруссия Дортмунд vs Бавария Мюнхен',
      time: '2023-11-03 19:00',
      league: 'Бундеслига',
    },
  ];

  // State variables for filters and selections
  const [clubSearchText, setClubSearchText] = useState('');
  const [leagueSearchText, setLeagueSearchText] = useState('');
  const [alreadyAdded, setAlreadyAdded] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const [selectedLeagues, setSelectedLeagues] = useState({});
  const [selectedClubs, setSelectedClubs] = useState({});
  const [selectedMatches, setSelectedMatches] = useState({});

  // Filtered data based on filters
  const matchesDataFiltered = matchesData.filter((match) => {
    let clubMatch = true;
    if (clubSearchText) {
      clubMatch = match.teams.toLowerCase().includes(clubSearchText.toLowerCase());
    }
    let leagueMatch = true;
    if (leagueSearchText) {
      leagueMatch = match.league.toLowerCase().includes(leagueSearchText.toLowerCase());
    }
    let dateMatch = true;
    if (selectedDate) {
      dateMatch = match.time.startsWith(selectedDate.format('YYYY-MM-DD'));
    }
    let alreadyAddedMatch = true;
    if (alreadyAdded) {
      alreadyAddedMatch = selectedMatches[match.key];
    }
    return clubMatch && leagueMatch && dateMatch && alreadyAddedMatch;
  });

  const clubsDataFiltered = clubsData.filter((club) => {
    let nameMatch = true;
    if (clubSearchText) {
      nameMatch = club.name.toLowerCase().includes(clubSearchText.toLowerCase());
    }
    let alreadyAddedMatch = true;
    if (alreadyAdded) {
      alreadyAddedMatch = selectedClubs[club.key];
    }
    return nameMatch && alreadyAddedMatch;
  });

  const leaguesDataFiltered = leaguesData.filter((league) => {
    let nameMatch = true;
    if (leagueSearchText) {
      nameMatch = league.name.toLowerCase().includes(leagueSearchText.toLowerCase());
    }
    let alreadyAddedMatch = true;
    if (alreadyAdded) {
      alreadyAddedMatch = selectedLeagues[league.key];
    }
    return nameMatch && alreadyAddedMatch;
  });

  return (
    <Layout>
      <Header style={{ background: '#fff' }}>
        <div style={{ float: 'right' }}>
          <Dropdown overlay={menu} trigger={['click']}>
            <Button icon={<EllipsisOutlined />} />
          </Dropdown>
        </div>
      </Header>
      <Content style={{ padding: '20px' }}>
        <div>
          <h2>Тип виджета</h2>
          <Radio.Group value={widgetType} onChange={onWidgetTypeChange}>
            <Radio.Button value="match">Матч</Radio.Button>
            <Radio.Button value="matches">Матчи</Radio.Button>
            <Radio.Button value="table">Таблица</Radio.Button>
          </Radio.Group>
        </div>
        <div style={{ marginTop: '20px' }}>
          {(widgetType === 'match' || widgetType === 'matches') && (
            <div>
              {/* Меню фильтрации */}
              <div style={{ marginBottom: '20px' }}>
                <Input.Search
                  style={{ width: 200, marginRight: '10px' }}
                  placeholder="Фильтр по клубу"
                  onSearch={(value) => setClubSearchText(value)}
                  onChange={(e) => setClubSearchText(e.target.value)}
                />
                <Input.Search
                  style={{ width: 200, marginRight: '10px' }}
                  placeholder="Фильтр по лиге"
                  onSearch={(value) => setLeagueSearchText(value)}
                  onChange={(e) => setLeagueSearchText(e.target.value)}
                />
                <DatePicker
                  placeholder="Фильтрация по дате"
                  style={{ marginRight: '10px' }}
                  onChange={(date) => setSelectedDate(date)}
                />
                <Checkbox
                  style={{ marginTop: '10px' }}
                  checked={alreadyAdded}
                  onChange={(e) => setAlreadyAdded(e.target.checked)}
                >
                  Уже добавлен
                </Checkbox>
              </div>
              {/* Разделитель между фильтрами и списком */}
              <Divider />
              {/* Список матчей */}
              <List
                dataSource={matchesDataFiltered}
                renderItem={(item) => (
                  <List.Item>
                    <Checkbox
                      checked={selectedMatches[item.key] || false}
                      onChange={(e) => {
                        setSelectedMatches({
                          ...selectedMatches,
                          [item.key]: e.target.checked,
                        });
                        setHasChanges(true);
                      }}
                    >
                      <div>
                        <div>{item.teams}</div>
                        <div>{item.time}</div>
                      </div>
                    </Checkbox>
                  </List.Item>
                )}
              />
              <Pagination
                defaultCurrent={1}
                total={matchesDataFiltered.length}
                style={{ marginTop: '10px' }}
              />
            </div>
          )}
          {widgetType === 'table' && (
            <div>
              {/* Меню фильтрации */}
              <div style={{ marginBottom: '20px' }}>
                <Input.Search
                  style={{ width: 200, marginRight: '10px' }}
                  placeholder="Поиск по названию лиги"
                  onSearch={(value) => setLeagueSearchText(value)}
                  onChange={(e) => setLeagueSearchText(e.target.value)}
                />
                <Checkbox
                  style={{ marginTop: '10px' }}
                  checked={alreadyAdded}
                  onChange={(e) => setAlreadyAdded(e.target.checked)}
                >
                  Уже добавлен
                </Checkbox>
              </div>
              <Divider />
              {/* Список лиг */}
              <List
                dataSource={leaguesDataFiltered}
                renderItem={(item) => (
                  <List.Item>
                    <Checkbox
                      checked={selectedLeagues[item.key] || false}
                      onChange={(e) => {
                        setSelectedLeagues({
                          ...selectedLeagues,
                          [item.key]: e.target.checked,
                        });
                        setHasChanges(true);
                      }}
                    >
                      {item.name}
                    </Checkbox>
                  </List.Item>
                )}
              />
              <Pagination
                defaultCurrent={1}
                total={leaguesDataFiltered.length}
                style={{ marginTop: '10px' }}
              />
            </div>
          )}
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        <Button
          type={hasChanges ? 'primary' : 'default'}
          disabled={!hasChanges}
          onClick={saveAndPublish}
        >
          Сохранить и опубликовать
        </Button>
      </Footer>
    </Layout>
  );
};

export default App;

