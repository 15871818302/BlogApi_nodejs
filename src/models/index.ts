import * as User from "./User";
import * as Post from "./Post";
import * as Category from "./Category";
import * as Comment from "./Comment";
import * as Media from "./Media";
import * as Setting from "./Setting";

export { User, Post, Category, Comment, Media, Setting };

// 初始化所有的集合索引
export async function initializeIndexes(db: any) {
  await User.createIndexes(db);
  await Post.createIndexes(db);
  await Category.createIndexes(db);
  await Comment.createIndexes(db);
  await Media.createIndexes(db);
  await Setting.createIndexes(db);

  console.log("数据库索引初始化完成");
}
