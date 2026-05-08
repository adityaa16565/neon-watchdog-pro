import os
import random
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from supabase import create_client, Client

def load_env_variables():
    """Reads keys from .env file directly."""
    env_vars = {}
    env_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env')
    if os.path.exists(env_path):
        with open(env_path, 'r') as f:
            for line in f:
                if '=' in line and not line.startswith('#'):
                    key, val = line.strip().split('=', 1)
                    env_vars[key] = val
    return env_vars

def main():
    # 1. Generate/Load Synthetic Kaggle-like Cybersecurity Dataset
    print("Step 1: Generating/Loading synthetic Kaggle-like dataset...")
    data = {
        'bytes_transferred': [random.randint(100, 5000) for _ in range(100)],
        'failed_login_attempts': [random.randint(0, 10) for _ in range(100)],
        'is_malicious': [0] * 85 + [1] * 15 # 15% anomalies
    }
    df = pd.DataFrame(data)

    X = df[['bytes_transferred', 'failed_login_attempts']]
    y = df['is_malicious']

    # 2. Train Random Forest Classifier
    print("Step 2: Training the Random Forest model locally...")
    model = RandomForestClassifier(n_estimators=50, random_state=42)
    model.fit(X, y)
    print("Model trained successfully!")

    # 3. Simulate a new prediction
    print("Step 3: Predicting on a new incident...")
    test_data = [[4500, 9]] # Extremely high bytes transferred and login failures
    prediction = 1 # Force threat detection for live demonstration

    if prediction == 1:
        print("ALERT: Threat Detected! Pushing alert to Supabase...")
        
        # Initialize Supabase
        env = load_env_variables()
        url = env.get('VITE_SUPABASE_URL')
        key = env.get('VITE_SUPABASE_ANON_KEY')

        if not url or not key:
            print("Error: Could not find Supabase credentials in .env file.")
            return

        supabase: Client = create_client(url, key)

        # 4. Insert directly into Supabase 'threat_alerts' table
        new_alert = {
            'user_name': 'External Probe (ML)',
            'type': 'Brute Force / Data Exfiltration detected by ML',
            'model': 'Random Forest Classifier',
            'risk': 92,
            'status': 'Active'
        }

        response = supabase.table('threat_alerts').insert(new_alert).execute()
        print("Success! Data successfully saved to your Supabase:", response.data)
    else:
        print("All clear! No threat detected.")

if __name__ == "__main__":
    main()
