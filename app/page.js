"use client";

import { useEffect, useState } from "react";
import { collection, query, getDocs, doc, setDoc, addDoc, getDoc, deleteDoc } from "firebase/firestore";
import { firestore } from "./firebase";
import './styles.css'; // Import the CSS file

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [itemName, setItemName] = useState('');
  const [itemQuantity, setItemQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const updateInventory = async () => {
    setLoading(true);
    setError('');
    try {
      const snapshot = query(collection(firestore, 'inventory'));
      const docs = await getDocs(snapshot);
      const inventoryList = [];

      docs.forEach(doc => {
        inventoryList.push({
          id: doc.id,
          ...doc.data()
        });
      });

      setInventory(inventoryList);
    } catch (error) {
      setError("Error fetching inventory.");
      console.error("Error updating inventory:", error);
    } finally {
      setLoading(false);
    }
  };

  const addItem = async () => {
    if (itemName.trim() === '' || itemQuantity <= 0) {
      setError("Please enter a valid item name and quantity.");
      return;
    }

    setLoading(true);
    setError('');
    try {
      await addDoc(collection(firestore, 'inventory'), {
        name: itemName,
        quantity: itemQuantity,
      });

      setItemName('');
      setItemQuantity(1);
      updateInventory();
    } catch (error) {
      setError("Error adding item.");
      console.error("Error adding item:", error);
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (itemId) => {
    setLoading(true);
    setError('');
    try {
      const docRef = doc(firestore, 'inventory', itemId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const { quantity } = docSnap.data();
        if (quantity === 1) {
          await deleteDoc(docRef);
        } else {
          await setDoc(docRef, { quantity: quantity - 1 });
        }
        updateInventory();
      } else {
        setError("Item does not exist.");
      }
    } catch (error) {
      setError("Error removing item.");
      console.error("Error removing item:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    updateInventory();
  }, []);

  return (
    <div className="container">
      <h1>Inventory Management</h1>

      <div className="input-group">
        <h2>Add New Item</h2>
        <input
          type="text"
          placeholder="Item Name"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Quantity"
          value={itemQuantity}
          onChange={(e) => setItemQuantity(Number(e.target.value))}
        />
        <button onClick={addItem} disabled={loading}>
          {loading ? 'Adding...' : 'Add Item'}
        </button>
        {error && <p className="error">{error}</p>}
      </div>

      {loading && <p className="loading">Loading...</p>}

      <ul>
        {inventory.map(item => (
          <li key={item.id}>
            {item.name} (Quantity: {item.quantity})
            <button onClick={() => removeItem(item.id)} disabled={loading}>
              {loading ? 'Removing...' : 'Remove'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}