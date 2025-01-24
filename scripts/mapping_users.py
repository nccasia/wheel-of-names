import json

# Load the two JSON files
with open('./input/roles.json', 'r') as file_roles:
    roles_data = json.load(file_roles)

with open('./input/users.json', 'r') as file_users:
    users_data = json.load(file_users)

# Create a mapping of role_id to role titles
role_id_to_title = {role['id']: role['title'] for role in roles_data['roles']['roles']}

# Match users with their roles
matched_users = []
for clan_user in users_data['clan_users']:
    user_info = clan_user['user']
    role_titles = [role_id_to_title.get(role_id, "Unknown") for role_id in clan_user.get('role_id', [])]
    matched_users.append({
        "userId": user_info['id'],
        "userName": user_info['username'],
        "roles": role_titles
    })

# Convert the result into JavaScript constants and MongoDB insert queries
js_constants = f"const users = {json.dumps(matched_users, indent=2)};"
mongodb_query = f"db.Users.insertMany({json.dumps(matched_users, indent=2)});"

# Save the outputs to files for inspection
js_constants_path = './output/users.js'
mongodb_query_path = './output/users_mongo.js'

with open(js_constants_path, 'w') as js_file:
    js_file.write(js_constants)

with open(mongodb_query_path, 'w') as mongo_file:
    mongo_file.write(mongodb_query)

(js_constants_path, mongodb_query_path)
print("Files saved successfully!")