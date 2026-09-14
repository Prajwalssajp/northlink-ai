"""
NORTHLINK AI - Dual Machine Learning Pipeline for NER Logistics
1. Corridor Disruption Prediction Model (Random Forest Classifier + GBR Regressor)
2. AI Reroute Recommendation Policy Model (Random Forest Decision Classifier)
Exports trained model weights to JSON for high-performance in-app inference.
"""

import numpy as np
import json
import os
from sklearn.ensemble import RandomForestClassifier, GradientBoostingRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, f1_score, mean_squared_error, r2_score

def generate_disruption_dataset(n_samples=2500, random_state=42):
    np.random.seed(random_state)
    
    # 1. Landslide hazard index (0 to 100)
    landslide_idx = np.random.beta(2, 5, n_samples) * 100
    
    # 2. 24h Rainfall intensity (mm)
    rainfall_mm = np.clip(np.random.exponential(45, n_samples), 0, 350)
    
    # 3. River discharge / flood level (0 to 100)
    flood_level = np.random.beta(2, 6, n_samples) * 100
    
    # 4. Road structural damage score (0 to 100)
    structural_damage = np.random.beta(1.5, 5, n_samples) * 100
    
    # 5. Mountain elevation slope gradient (degrees, 5 to 35)
    slope_gradient = np.random.uniform(5, 35, n_samples)
    
    # 6. Historical bottleneck frequency (0 to 15)
    historical_choke = np.random.poisson(3.5, n_samples)
    
    latent_score = (
        0.35 * landslide_idx +
        0.25 * (rainfall_mm / 3.5) +
        0.20 * flood_level +
        0.15 * structural_damage +
        0.05 * (slope_gradient * 2.5)
    )
    
    # Target 1: Binary Disruption Event
    prob = 1.0 / (1.0 + np.exp(-(latent_score - 45.0) / 9.0))
    disruption_binary = (np.random.rand(n_samples) < prob).astype(int)
    
    # Target 2: Delay in Hours
    delay_base = np.maximum(0, (latent_score - 28) * 0.16)
    delay_noise = np.random.normal(0, 0.25, n_samples)
    delay_hours = np.maximum(0, delay_base + delay_noise)
    
    X = np.column_stack([
        landslide_idx,
        rainfall_mm,
        flood_level,
        structural_damage,
        slope_gradient,
        historical_choke
    ])
    
    feature_names = [
        "landslide_idx",
        "rainfall_mm",
        "flood_level",
        "structural_damage",
        "slope_gradient",
        "historical_choke"
    ]
    
    return X, disruption_binary, delay_hours, feature_names

def generate_recommendation_dataset(n_samples=2000, random_state=123):
    np.random.seed(random_state)
    
    # Features for Reroute Decision:
    # 1. Primary route risk score (0 to 100)
    primary_risk = np.random.uniform(10, 95, n_samples)
    # 2. Alternative bypass risk score (0 to 100)
    alt_risk = np.random.uniform(10, 50, n_samples)
    # 3. Projected delay on primary (minutes)
    primary_delay_mins = np.maximum(0, (primary_risk - 30) * 4.5 + np.random.normal(0, 15, n_samples))
    # 4. Projected delay on bypass (minutes)
    alt_delay_mins = np.maximum(0, (alt_risk - 20) * 1.2 + np.random.normal(0, 5, n_samples))
    # 5. Distance difference in km (bypass is usually 10 to 60 km longer)
    extra_distance_km = np.random.uniform(10, 65, n_samples)
    # 6. Priority level (1=STANDARD, 2=HIGH, 3=CRITICAL)
    priority_level = np.random.choice([1, 2, 3], size=n_samples, p=[0.3, 0.4, 0.3])
    # 7. Commodity sensitivity (1=Construction, 2=Food, 3=Medicines/Emergency)
    commodity_sensitivity = np.random.choice([1, 2, 3], size=n_samples, p=[0.25, 0.4, 0.35])
    
    # Policy target calculation:
    # Net utility of taking bypass = delay_saved_mins * priority_multiplier - extra_distance_penalty + risk_differential
    delay_saved = primary_delay_mins - alt_delay_mins
    risk_diff = primary_risk - alt_risk
    
    utility_bypass = (
        0.45 * (risk_diff) +
        0.35 * (delay_saved / 2.0) * (priority_level / 2.0) * (commodity_sensitivity / 2.0) -
        0.20 * (extra_distance_km * 0.8)
    )
    
    prob_recommend_bypass = 1.0 / (1.0 + np.exp(-(utility_bypass - 12.0) / 7.0))
    # Target: 1 = RECOMMEND BYPASS, 0 = MAINTAIN PRIMARY
    recommend_bypass = (np.random.rand(n_samples) < prob_recommend_bypass).astype(int)
    
    X_rec = np.column_stack([
        primary_risk,
        alt_risk,
        primary_delay_mins,
        alt_delay_mins,
        extra_distance_km,
        priority_level,
        commodity_sensitivity
    ])
    
    rec_features = [
        "primary_risk",
        "alt_risk",
        "primary_delay_mins",
        "alt_delay_mins",
        "extra_distance_km",
        "priority_level",
        "commodity_sensitivity"
    ]
    
    return X_rec, recommend_bypass, rec_features

def train_and_export():
    print("[INFO] Generating NER disruption training dataset (2,500 samples)...")
    X_d, y_disrupt, y_delay, d_features = generate_disruption_dataset()
    
    X_d_train, X_d_test, y_d_train, y_d_test, y_del_train, y_del_test = train_test_split(
        X_d, y_disrupt, y_delay, test_size=0.2, random_state=42
    )
    
    # 1. Random Forest Classifier for Disruption
    rf_disrupt = RandomForestClassifier(n_estimators=25, max_depth=6, class_weight='balanced', random_state=42)
    rf_disrupt.fit(X_d_train, y_d_train)
    d_acc = accuracy_score(y_d_test, rf_disrupt.predict(X_d_test))
    d_f1 = f1_score(y_d_test, rf_disrupt.predict(X_d_test))
    print(f"[OK] Disruption RF Model: Accuracy={d_acc:.3f}, F1-Score={d_f1:.3f}")
    
    # 2. Gradient Boosting Regressor for Delay
    gbr = GradientBoostingRegressor(n_estimators=30, max_depth=4, random_state=42)
    gbr.fit(X_d_train, y_del_train)
    del_pred = gbr.predict(X_d_test)
    del_rmse = np.sqrt(mean_squared_error(y_del_test, del_pred))
    del_r2 = r2_score(y_del_test, del_pred)
    print(f"[OK] GBR Delay Regressor: RMSE={del_rmse:.3f} hrs, R2={del_r2:.3f}")
    
    # 3. Random Forest Classifier for Corridor Recommendation Decision
    print("[INFO] Generating ML Reroute Recommendation Policy dataset (2,000 samples)...")
    X_rec, y_rec, rec_features = generate_recommendation_dataset()
    X_r_train, X_r_test, y_r_train, y_r_test = train_test_split(
        X_rec, y_rec, test_size=0.2, random_state=123
    )
    
    rf_rec = RandomForestClassifier(n_estimators=25, max_depth=5, class_weight='balanced', random_state=123)
    rf_rec.fit(X_r_train, y_r_train)
    r_acc = accuracy_score(y_r_test, rf_rec.predict(X_r_test))
    r_f1 = f1_score(y_r_test, rf_rec.predict(X_r_test))
    print(f"[OK] Reroute Policy Classifier: Accuracy={r_acc:.3f}, F1-Score={r_f1:.3f}")
    
    # Export trees for Disruption RF
    disrupt_trees = []
    for est in rf_disrupt.estimators_[:10]:
        tree = est.tree_
        disrupt_trees.append({
            "children_left": tree.children_left.tolist(),
            "children_right": tree.children_right.tolist(),
            "feature": tree.feature.tolist(),
            "threshold": tree.threshold.tolist(),
            "value": [val[0].tolist() for val in tree.value]
        })
        
    # Export trees for Recommendation RF
    rec_trees = []
    for est in rf_rec.estimators_[:10]:
        tree = est.tree_
        rec_trees.append({
            "children_left": tree.children_left.tolist(),
            "children_right": tree.children_right.tolist(),
            "feature": tree.feature.tolist(),
            "threshold": tree.threshold.tolist(),
            "value": [val[0].tolist() for val in tree.value]
        })
        
    disrupt_importances = dict(zip(d_features, [round(x, 4) for x in rf_disrupt.feature_importances_.tolist()]))
    rec_importances = dict(zip(rec_features, [round(x, 4) for x in rf_rec.feature_importances_.tolist()]))
    
    export_payload = {
        "model_type": "Dual-Ensemble RandomForest (Disruption & Policy Reroute)",
        "training_samples": len(X_d) + len(X_rec),
        "metrics": {
            "disruption_accuracy": round(d_acc, 4),
            "disruption_f1": round(d_f1, 4),
            "delay_rmse_hours": round(del_rmse, 3),
            "delay_r2": round(del_r2, 4),
            "recommendation_accuracy": round(r_acc, 4),
            "recommendation_f1": round(r_f1, 4)
        },
        "feature_names": d_features,
        "feature_importances": disrupt_importances,
        "recommendation_feature_names": rec_features,
        "recommendation_feature_importances": rec_importances,
        "trees": disrupt_trees,
        "recommendation_trees": rec_trees
    }
    
    output_path = os.path.join(os.path.dirname(__file__), "..", "src", "lib", "trained_model_weights.json")
    with open(output_path, "w") as f:
        json.dump(export_payload, f, indent=2)
        
    print(f"[SUCCESS] Exported trained weights with Dual Random Forest models to {output_path}!")

if __name__ == "__main__":
    train_and_export()
