import axios from "axios";

function getLocalStorage(key, defaultToken = undefined) {
  if (process.client) {
    const value = localStorage.getItem(key);
    if (key === "query_access_token" && !value) {
      return defaultToken;
    }
    return value;
  }
}

function setLocalStorage(key, value) {
  if (process.client) {
    localStorage.setItem(key, value);
  }
}

function getDeviceType() {
  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    // return "Tablet";
    return "T";
  } else if (
    /Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
      ua
    )
  ) {
    // return "Mobile";
    return "M";
  }
  // return "Desktop";
  return "D";
}

function getBrowserType() {
  const test = (regexp) => {
    return regexp.test(navigator.userAgent);
  };

  if (test(/opr\//i) || !!window.opr) {
    // return "Opera";
    return "O";
  } else if (test(/edg/i)) {
    // return "MicrosoftEdge";
    return "ME";
  } else if (test(/chrome|chromium|crios/i)) {
    // return "GoogleChrome";
    return "GC";
  } else if (test(/firefox|fxios/i)) {
    // return "MozillaFirefox";
    return "MF";
  } else if (test(/safari/i)) {
    // return "AppleSafari";
    return "AS";
  } else if (test(/trident/i)) {
    // return "MicrosoftInternetExplorer";
    return "MIE";
  } else if (test(/ucbrowser/i)) {
    // return "UCBrowser";
    return "UCB";
  } else if (test(/samsungbrowser/i)) {
    // return "SamsungBrowser";
    return "SB";
  } else {
    // return "Unknown";
    return "U";
  }
}

function generateMachineId() {
  const deviceType = getDeviceType();
  const browserType = getBrowserType();
  let result = `${deviceType}_${browserType}_`;
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < 12; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function getMachineId() {
  let machineId = getLocalStorage("machine_id");
  if (!machineId) {
    machineId = generateMachineId();
    setLocalStorage("machine_id", machineId);
  }
  return machineId;
}

async function fetchAccessToken(path, user) {
  const machineId = getMachineId();
  const expiration =
    getLocalStorage("auth.strategy") === "local"
      ? getLocalStorage("auth._token_expiration.local")
      : getLocalStorage("auth._token_expiration.google");
  const payload = {
    email: user,
    machine: machineId,
    expiration: expiration,
  };
  await axios
    .post(`${path}/access/token`, payload)
    .then((response) => {
      setLocalStorage("query_access_token", response.data.access_token);
    })
    .catch((error) => {
      throw new Error(`${error}`);
    });
}

async function fetchOneOffToken(path, defaultToke) {
  const accessToken = getLocalStorage("query_access_token", defaultToke);
  await axios
    .get(`${path}/access/oneoff`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((response) => {
      setLocalStorage("one_off_token", response.data.one_off_token);
    })
    .catch((error) => {
      throw new Error(`${error}`);
    });
}

async function revokeAccess(path, defaultToke) {
  const accessToken = getLocalStorage("query_access_token", defaultToke);
  await axios
    .delete(`${path}/access/revoke`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((res) => {
      const tokenMatch =
        getLocalStorage("query_access_token") ===
        res.headers["x-public-access"];
      if (!tokenMatch) {
        setLocalStorage("query_access_token", res.headers["x-public-access"]);
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

async function fetchPaginationData(
  path,
  filter,
  limit,
  page,
  search,
  relation,
  sort,
  defaultToke
) {
  const accessToken = getLocalStorage("query_access_token", defaultToke);
  let pagination = {
    items: [],
    total: 0,
  };
  const payload = {
    filter: filter,
    limit: parseInt(limit),
    page: parseInt(page),
    relation: relation,
    order: sort,
  };
  await axios
    .post(`${path}/graphql/pagination?search=${search}`, payload, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((res) => {
      pagination = res.data;
      setLocalStorage("one_off_token", res.headers["x-one-off"]);
    })
    .catch((err) => {
      console.log(err);
    });
  return pagination;
}

async function fetchQueryData(path, node, filter, search, mode, defaultToke) {
  const accessToken = getLocalStorage("query_access_token", defaultToke);
  let query = {};
  let payload = {
    node: node,
    filter: filter,
    search: search,
  };
  await axios
    .post(`${path}/graphql/query?mode=${mode}`, payload, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((res) => {
      query = res.data;
      setLocalStorage("one_off_token", res.headers["x-one-off"]);
    })
    .catch((err) => {
      console.log(err);
    });
  return query;
}

async function fetchRecordData(path, uuid, defaultToke) {
  const accessToken = getLocalStorage("query_access_token", defaultToke);
  let record = {};
  await axios
    .get(`${path}/record/${uuid}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((res) => {
      record = res.data.record;
      setLocalStorage("one_off_token", res.headers["x-one-off"]);
      const public_access = res.headers["x-public-access"];
      if (public_access === accessToken)
        setLocalStorage("query_access_token", public_access);
    })
    .catch((err) => {
      record.status = err.response.status;
      record.message = err.response.data.detail;
    });
  return record;
}

async function fetchFilterData(path, sidebar, defaultToke) {
  const accessToken = getLocalStorage("query_access_token", defaultToke);
  let filter = {};
  await axios
    .get(`${path}/filter?sidebar=${sidebar}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((res) => {
      filter = res.data;
    })
    .catch((err) => {
      console.log(err);
    });
  return filter;
}

async function fetchFiles(path, filepath, defaultToke) {
  const accessToken = getLocalStorage("query_access_token", defaultToke);
  let files = {};
  let payload = {
    path: filepath,
  };
  await axios
    .post(`${path}/collection`, payload, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((res) => {
      files = res.data;
    });
  return files;
}

export default {
  getLocalStorage,
  setLocalStorage,
  fetchAccessToken,
  fetchOneOffToken,
  revokeAccess,
  fetchPaginationData,
  fetchQueryData,
  fetchRecordData,
  fetchFilterData,
  fetchFiles,
};
