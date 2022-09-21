import base64 from "base-64";
import formatISO from "date-fns/formatISO";

export async function getAuthToken(username, password) {
  let response = await fetch("/auth/token", {
    method: 'GET',
    headers: {
      'Authorization': 'Basic ' + base64.encode(username + ":" + password)
    }
  })
  if (response.ok) {
    return await response.json();
  } else {
    throw 'Invalid login'
  }
}

export async function getRecsTag(tag, token) {
  try {
    let response = await fetch("/recs/tag/"+ tag, {
    method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + token
      }
    });
    return await response.json();
  } catch (e) {
    console.log(e);
  }
}

export async function getHis(id, start, end, token) {
  try {
    let response = await fetch("/his/" + id + "?start=" + start + "&end=" + end, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + token
      }
    });
    return await response.json();
  } catch (e) {
    console.log(e);
  }
}

export async function postHis(id, ts, value, token) {
  try {
    let body = {
      pointId: id,
      ts: formatISO(ts), // We use date-fns implementation here to avoid milliseconds (Swift hates them and me)
      value: value
    };
    await fetch("/his/" + id, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
  } catch (e) {
    console.log(e);
  }
}