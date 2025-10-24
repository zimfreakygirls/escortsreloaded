-- Allow users to view their own approval status
CREATE POLICY "Users can view their own status"
ON user_status
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);