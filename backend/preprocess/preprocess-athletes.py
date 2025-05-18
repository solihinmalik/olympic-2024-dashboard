import pandas as pd
import unidecode
from datetime import datetime

def normalize_name(name):
    if pd.isna(name):
        return ''
    name = unidecode.unidecode(name)  # remove accents
    return name.strip().lower()

# Load the files
athletes_df = pd.read_csv('./dataset/athletes.csv')
medals_df = pd.read_csv('./dataset/medallists.csv')

# DEBUG: Print the column names in your CSV
print("📋 Athlete CSV Columns:", athletes_df.columns.tolist())
print("🔍 First 3 rows:")
print(athletes_df.head(3))

# Format name as "FirstName LastName"
def reformat_name(name):
    if pd.isna(name):
        return ''
    parts = name.strip().split()
    if len(parts) < 2:
        return name.title()
    last_name = parts[0].capitalize()
    first_names = ' '.join(parts[1:]).title()
    return f"{first_names} {last_name}"

# Apply it to create a display-friendly version of the name
athletes_df['name_formatted'] = athletes_df['name'].apply(reformat_name)


# Normalize name columns
if 'name' in athletes_df.columns:
    athletes_df['name_clean'] = athletes_df['name'].apply(normalize_name)
else:
    athletes_df['name_clean'] = ''

if 'full_name' in athletes_df.columns:
    athletes_df['full_name_clean'] = athletes_df['full_name'].apply(normalize_name)
else:
    athletes_df['full_name_clean'] = ''


if 'name' in medals_df.columns:
    medals_df['name_clean'] = medals_df['name'].apply(normalize_name)
else:
    medals_df['name_clean'] = ''

if 'full_name' in medals_df.columns:
    medals_df['full_name_clean'] = medals_df['full_name'].apply(normalize_name)
else:
    medals_df['full_name_clean'] = ''

# Normalize columns
athletes_df.columns = [col.strip().lower() for col in athletes_df.columns]

# Compute age from birth_date (if present)
if 'birth_date' in athletes_df.columns:
    def calculate_age(birth_str):
        try:
            birth = pd.to_datetime(birth_str, errors='coerce')
            if pd.isnull(birth):
                return None
            today = pd.Timestamp.today()
            return int((today - birth).days / 365.25)
        except:
            return None

    athletes_df['age'] = athletes_df['birth_date'].apply(calculate_age)

# Now filter rows with valid gender and computed age
if 'age' in athletes_df.columns and 'gender' in athletes_df.columns:
    athletes_df = athletes_df[
        athletes_df['age'].notna() & athletes_df['gender'].notna()
    ]
else:
    print("⚠️ Missing 'age' or 'gender' column after processing.")

# Save cleaned files
athletes_df.to_csv('dataset/athletes_clean.csv', index=False)
medals_df.to_csv('dataset/medallists_clean.csv', index=False)

print("✅ Cleaned CSVs saved as 'athletes_clean.csv' and 'medallists_clean.csv'")
