import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

async function createTestData() {
  try {
    // Create developer
    const developerResponse = await axios.post(`${API_URL}/users`, {
      name: "John Developer",
      email: "john@example.com",
      role: "developer",
      slackUserId: "U1234567890",
      slackWorkspaceId: "T1234567890"
    });
    const developerId = developerResponse.data.id;
    console.log('Created developer:', developerId);

    // Create client
    const clientResponse = await axios.post(`${API_URL}/users`, {
      name: "Alice Client",
      email: "alice@example.com",
      role: "client",
      slackUserId: "U0987654321",
      slackWorkspaceId: "T1234567890"
    });
    const clientId = clientResponse.data.id;
    console.log('Created client:', clientId);

    // Create issue from client
    const issueResponse = await axios.post(`${API_URL}/issues`, {
      title: "Fix login page responsiveness",
      description: "The login page is not displaying correctly on mobile devices. The input fields are too small and the submit button is cut off on iPhone screens.",
      priority: "high",
      reporterId: clientId,
      assigneeId: developerId
    });
    console.log('Created issue:', issueResponse.data.id);

  } catch (error) {
    console.error('Error creating test data:', error.response?.data || error.message);
  }
}

createTestData(); 