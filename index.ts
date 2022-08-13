import config from './config.json';
import { 
  readFile, 
  writeFile 
} from 'fs/promises';
const {token, urlDate, userId } = config;

type User = {
  canFollow: boolean,
  displayName: string,
  isCurrentlyActive: boolean,
  isFollowedBy: boolean,
  isFollowing: boolean,
  isVerified: boolean,
  picture: string,
  totalXp: number,
  userId: number,
  username: string
}

const getFriends = async (following: boolean): Promise<User[]> => {
  let result: User[];
  const type = following ? 'following' : 'followers';
  const fileName = `${type}.json`;
  try {
    result = JSON.parse(await readFile(fileName, 'utf8'));
  }
  catch {}
  if (!result) {
    const response = await fetch(`https://www.duolingo.com/${urlDate}/friends/users/${userId}/${type}?pageSize=500`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    result = (await response.json())[type].users;
    await writeFile(fileName, JSON.stringify(result));
  }
  return result;
}

const unfollow = async (unfollowId: number): Promise<boolean> => {
  const result = await (
    await fetch(`https://www.duolingo.com/${urlDate}/friends/users/${userId}/follow/${unfollowId}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
    ).json();
  return result.successful;
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const removeFollower = async (removeId: number): Promise<boolean> => {
  const resultBlock = await (
    await fetch(`https://www.duolingo.com/${urlDate}/friends/users/${userId}/block/${removeId}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
    ).json();
  let successful = resultBlock.successful;
  await sleep(100);
  const resultUnblock = await (
    await fetch(`https://www.duolingo.com/${urlDate}/friends/users/${userId}/block/${removeId}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
    ).json();
  successful = successful && resultUnblock.successful;
  return successful;
}

const main = async (): Promise<void> => {
  const following = await getFriends(true);
  console.log(`Got ${following.length} followed users`);
  const followers = await getFriends(false);
  console.log(`Got ${followers.length} followers`);
  for (const user of following) {
    const success = await unfollow(user.userId);
    if (success) {
      console.log(`✅ Unfollowed ${user.username}`);
    }
    else {
      console.log(`❌ Failed to unfollow ${user.username}`);
    }
    await sleep(100);
  }
  for (const user of followers) {
    const success = await removeFollower(user.userId);
    if (success) {
      console.log(`✅ Removed ${user.username}`);
    }
    else {
      console.log(`❌ Failed to remove ${user.username}`);
    }
    await sleep(100);
  }
}

main();